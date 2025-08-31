import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, MapPin, CreditCard, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/contexts/CartContext";
import { useLocationDetection } from "@/components/shop/LocationDetector";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PayPalProvider } from "@/components/shop/PayPalProvider";
import { PayPalButton } from "@/components/shop/PayPalButton";
import { BankTransferModal } from "@/components/shop/BankTransferModal";

const orderSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(10, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  deliveryMethod: z.enum(['local_delivery', 'pickup', 'shipping']),
  deliveryNotes: z.string().optional(),
  paymentPreference: z.enum(['pay_now', 'bank_transfer', 'cash_on_delivery']),
});

type OrderFormData = z.infer<typeof orderSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { 
    isTurksAndCaicos, 
    country, 
    isLoading,
  } = useLocationDetection();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentOrderNumber, setCurrentOrderNumber] = useState<string>('');
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);

  const { subtotal, shipping, tax, total } = getCartTotal();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      country: country || (isTurksAndCaicos ? 'Turks and Caicos' : ''),
      deliveryMethod: isTurksAndCaicos ? 'local_delivery' : 'shipping',
      paymentPreference: isTurksAndCaicos ? 'cash_on_delivery' : 'bank_transfer',
    }
  });

  const selectedPaymentPreference = form.watch('paymentPreference');

  // Show bank transfer modal when selected
  useEffect(() => {
    if (selectedPaymentPreference === 'bank_transfer') {
      setShowBankTransferModal(true);
    }
  }, [selectedPaymentPreference]);

  // Redirect to cart if empty
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data: OrderFormData) => {
    try {
      if (cartItems.length === 0) {
        toast({
          title: "Empty Cart",
          description: "Please add items to your cart before placing an order.",
          variant: "destructive"
        });
        return;
      }

      setIsSubmitting(true);
      // Prepare order data
      const orderData = {
        email: data.email,
        phone: data.phone,
        first_name: data.firstName,
        last_name: data.lastName,
        shipping_address: {
          address: data.address,
          city: data.city,
          postal_code: data.postalCode || '',
          country: data.country
        },
        billing_address: {
          address: data.address,
          city: data.city,
          postal_code: data.postalCode || '',
          country: data.country
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type
        })),
        subtotal: subtotal,
        shipping_cost: shipping,
        tax_amount: tax,
        total_amount: total,
        order_type: data.paymentPreference === 'pay_now' ? 'purchase' : 'request',
        payment_status: data.paymentPreference === 'pay_now' ? 'unpaid' : 'not_required',
        customer_location: isTurksAndCaicos ? 'turks_caicos' : 'international',
        delivery_method: data.deliveryMethod,
        delivery_notes: data.deliveryNotes || '',
        payment_method: data.paymentPreference
      };

      const { data: order, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Store order number for PayPal integration
      setCurrentOrderNumber(order.order_number);

      // For non-PayPal payments, clear cart and navigate to confirmation
      if (data.paymentPreference !== 'pay_now') {
        clearCart();
        navigate(`/order-confirmation/${order.order_number}`);
      }
      
      // For PayPal payments, keep cart until payment is completed

    } catch (error: any) {
      console.error('Order submission error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      toast({
        title: "Order Submission Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDeliveryOptions = () => {
    if (isTurksAndCaicos) {
      return [
        { value: 'local_delivery', label: 'Local Delivery (Free for orders $50+)' }
      ];
    } else {
      return [
        { value: 'shipping', label: 'International Shipping' }
      ];
    }
  };

  const getPaymentOptions = () => {
    const baseOptions = [
      { value: 'bank_transfer', label: 'Bank Transfer' }
    ];

    if (isTurksAndCaicos) {
      baseOptions.unshift(
        { value: 'cash_on_delivery', label: 'Cash on Delivery' },
        { value: 'pay_now', label: 'Pay with PayPal' }
      );
    } else {
      baseOptions.push(
        { value: 'pay_now', label: 'Pay with PayPal' }
      );
    }

    return baseOptions;
  };

  const handlePayPalSuccess = (paypalOrderId: string, captureId: string) => {
    clearCart();
    toast({
      title: "Payment Successful!",
      description: "Your order has been completed. Redirecting to confirmation...",
    });
    
    // Small delay to show success message before redirect
    setTimeout(() => {
      navigate(`/order-confirmation/${currentOrderNumber}`);
    }, 1500);
  };

  const handlePayPalError = (error: any) => {
    console.error('PayPal payment failed:', error);
    toast({
      title: "Payment Failed",
      description: "PayPal payment failed. Please try again or use a different payment method.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/cart')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {isTurksAndCaicos ? (
              /* T&C Customers - Inline Checkout Form */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Complete Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Location Indicator */}
                  <Card className="bg-primary/5 border-primary/20 mb-6">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>
                          Detected Location: <strong>{country}</strong>
                          <Badge variant="secondary" className="ml-2">Local Customer</Badge>
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Contact Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Smith" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="e.g., john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., (649) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Delivery Address */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Delivery Address</h3>
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Textarea placeholder="e.g., 123 Conch Way, Grace Bay" {...field} rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Providenciales" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., TKCA 1ZZ" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="Turks and Caicos" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Delivery Method */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Delivery Preferences</h3>
                        <FormField
                          control={form.control}
                          name="deliveryMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Method</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select delivery method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getDeliveryOptions().map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deliveryNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  rows={3}
                                  placeholder="Any special delivery instructions..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Payment Preference */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Payment Preference
                        </h3>
                        <FormField
                          control={form.control}
                          name="paymentPreference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>How would you like to pay?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getPaymentOptions().map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                         {/* Bank Transfer Notice */}
                         {selectedPaymentPreference === 'bank_transfer' && (
                           <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                             <div className="space-y-2">
                               <h4 className="font-medium text-sm flex items-center gap-2">
                                 <CreditCard className="h-4 w-4" />
                                 Bank Transfer Selected
                               </h4>
                               <p className="text-sm text-muted-foreground">
                                 After submitting your order, you'll receive complete bank transfer details with your order number for payment reference.
                               </p>
                             </div>
                           </div>
                         )}

                         {/* PayPal Notice */}
                         {selectedPaymentPreference === 'pay_now' && (
                           <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                             <div className="space-y-2">
                               <h4 className="font-medium text-sm flex items-center gap-2">
                                 <CreditCard className="h-4 w-4" />
                                 PayPal Payment Selected
                               </h4>
                               <p className="text-sm text-muted-foreground">
                                 After submitting your order details, you'll be able to complete payment using PayPal.
                               </p>
                             </div>
                           </div>
                         )}
                       </div>

                       {/* Regular form submission for non-PayPal payments */}
                       {selectedPaymentPreference !== 'pay_now' ? (
                         <Button 
                           type="submit" 
                           className="w-full"
                           disabled={isSubmitting || cartItems.length === 0}
                         >
                           {isSubmitting ? 'Submitting...' : 
                            selectedPaymentPreference === 'bank_transfer' ? 'Submit Order (Bank Transfer)' :
                            'Submit Order Request'}
                         </Button>
                       ) : (
                         <div className="space-y-4">
                           <Button 
                             type="submit" 
                             className="w-full"
                             disabled={isSubmitting || cartItems.length === 0}
                           >
                             {isSubmitting ? 'Preparing PayPal Payment...' : 'Prepare Order for PayPal Payment'}
                           </Button>
                           
                           {currentOrderNumber && (
                             <PayPalProvider>
                               <div className="border rounded-lg p-4">
                                 <h4 className="font-medium mb-2">Complete Payment with PayPal</h4>
                                 <PayPalButton
                                   amount={total}
                                   orderId={currentOrderNumber}
                                   onSuccess={handlePayPalSuccess}
                                   onError={handlePayPalError}
                                 />
                               </div>
                             </PayPalProvider>
                           )}
                         </div>
                       )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            ) : (
              /* International Customers - Simple Pay Now */
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="mb-4">
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <MapPin className="h-3 w-3" />
                      {isLoading ? 'Detecting location...' : country}
                    </Badge>
                  </div>
                  
                   <h3 className="font-medium text-sm text-muted-foreground mb-4">
                     Secure PayPal payment:
                   </h3>
                   
                   <PayPalProvider>
                     <PayPalButton
                       amount={total}
                       orderId={`INTL-${Date.now()}`}
                       onSuccess={handlePayPalSuccess}
                       onError={handlePayPalError}
                     />
                   </PayPalProvider>
                  
                   <p className="text-xs text-muted-foreground text-center pt-2">
                     International shipping • Secure PayPal payment
                   </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Bank Transfer Modal */}
      <BankTransferModal
        isOpen={showBankTransferModal}
        onClose={() => setShowBankTransferModal(false)}
        orderTotal={total}
        orderNumber={currentOrderNumber || undefined}
      />
    </div>
  );
};

export default Checkout;