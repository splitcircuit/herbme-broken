import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Copy, CheckCircle2, Clock, MapPin, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  shipping_address: any;
  items: any;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string;
  customer_location: string;
  delivery_method: string;
  delivery_notes: string;
  created_at: string;
  status: string;
  payment_status: string;
}

const BankTransferConfirmation = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) {
          throw error;
        }

        setOrder(data);
      } catch (error: any) {
        console.error('Error fetching order:', error);
        toast({
          title: "Order Not Found",
          description: "Unable to find the specified order.",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate, toast]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`
      });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const isTurksAndCaicos = order.customer_location === 'turks_caicos';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Bank Transfer Instructions</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Success Message */}
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-green-900">Order Created Successfully!</h2>
                    <p className="text-green-700">Order #{order.order_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Clock className="h-4 w-4" />
                  <span>Created on {new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Bank Transfer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Bank Transfer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h3 className="font-semibold mb-4 text-primary">Important: Complete Your Payment</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please transfer the exact amount to the account below and include your order number in the reference.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-background rounded border">
                      <div>
                        <p className="text-sm text-muted-foreground">Bank</p>
                        <p className="font-medium">First Caribbean International Bank</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-background rounded border">
                      <div>
                        <p className="text-sm text-muted-foreground">Account Name</p>
                        <p className="font-medium">Conch Co. Ltd</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-background rounded border">
                      <div>
                        <p className="text-sm text-muted-foreground">Account Number</p>
                        <p className="font-medium">123456789</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard('123456789', 'Account Number')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-background rounded border">
                      <div>
                        <p className="text-sm text-muted-foreground">Routing Number</p>
                        <p className="font-medium">987654321</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard('987654321', 'Routing Number')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded border border-primary/20">
                      <div>
                        <p className="text-sm text-muted-foreground">Transfer Amount</p>
                        <p className="font-bold text-lg">${order.total_amount.toFixed(2)}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(order.total_amount.toFixed(2), 'Amount')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded border border-primary/20">
                      <div>
                        <p className="text-sm text-muted-foreground">Reference (IMPORTANT)</p>
                        <p className="font-bold text-lg">{order.order_number}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(order.order_number, 'Order Number')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-2">Next Steps</h4>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    <li>Complete the bank transfer using the details above</li>
                    <li>Include the order number <strong>{order.order_number}</strong> in the transfer reference</li>
                    <li>We'll confirm your payment within 1-2 business days</li>
                    <li>Once confirmed, we'll prepare and ship your order</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about your order or need assistance with the bank transfer, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> orders@conchco.com</p>
                  <p><strong>Phone:</strong> (649) 123-4567</p>
                  <p><strong>Hours:</strong> Monday - Friday, 9am - 5pm (EST)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    {isTurksAndCaicos ? 'Local' : 'International'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-medium">{order.order_number}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{order.first_name} {order.last_name}</p>
                  <p className="text-sm text-muted-foreground">{order.email}</p>
                </div>

                <Separator />

                {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-start">
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
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {order.shipping_cost === 0 ? 'Free' : `$${order.shipping_cost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${order.tax_amount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-xs text-muted-foreground text-center">
                    Delivery: {order.delivery_method.replace('_', ' ')}
                  </p>
                  {order.delivery_notes && (
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      Note: {order.delivery_notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransferConfirmation;