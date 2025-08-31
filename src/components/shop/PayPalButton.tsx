import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PAYPAL_CONFIG, type PayPalOrderData } from "@/config/paypal";

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  orderId: string;
  onSuccess: (paypalOrderId: string, captureId: string) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export const PayPalButton = ({
  amount,
  currency = PAYPAL_CONFIG.currency,
  orderId,
  onSuccess,
  onError,
  onCancel,
  disabled = false
}: PayPalButtonProps) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      intent: PAYPAL_CONFIG.intent,
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          reference_id: orderId,
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  };

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    
    try {
      const orderData: PayPalOrderData = await actions.order.capture();
      
      if (orderData.status === "COMPLETED") {
        const captureId = orderData.purchase_units?.[0]?.payments?.captures?.[0]?.id;
        const payerId = orderData.payer?.payer_id;
        
        if (captureId) {
          // Update the order in Supabase with PayPal payment details
          const { error } = await supabase
            .from('orders')
            .update({
              paypal_order_id: orderData.id,
              paypal_payer_id: payerId,
              paypal_capture_id: captureId,
              paypal_status: orderData.status,
              payment_status: 'paid'
            })
            .eq('order_number', orderId);

          if (error) {
            throw error;
          }

          toast({
            title: "Payment Successful!",
            description: "Your PayPal payment has been processed successfully.",
          });

          onSuccess(orderData.id, captureId);
        } else {
          throw new Error("No capture ID received from PayPal");
        }
      } else {
        throw new Error(`PayPal order status: ${orderData.status}`);
      }
    } catch (error: any) {
      console.error('PayPal payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your PayPal payment.",
        variant: "destructive"
      });
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onErrorHandler = (error: any) => {
    console.error('PayPal error:', error);
    toast({
      title: "PayPal Error",
      description: "There was an error with PayPal. Please try again.",
      variant: "destructive"
    });
    onError(error);
  };

  const onCancelHandler = () => {
    toast({
      title: "Payment Cancelled",
      description: "Your PayPal payment was cancelled.",
      variant: "default"
    });
    onCancel?.();
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="paypal-button-container">
      {isProcessing && (
        <div className="flex items-center justify-center p-4 mb-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 text-sm">Processing payment...</span>
        </div>
      )}
      
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
          height: 40,
        }}
        disabled={disabled || isProcessing}
        forceReRender={[amount, currency, orderId]}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={onCancelHandler}
      />
    </div>
  );
};