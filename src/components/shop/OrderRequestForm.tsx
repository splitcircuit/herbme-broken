import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Package, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLocationDetection } from './LocationDetector';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  paymentPreference: z.enum(['pay_now', 'request_quote', 'cash_on_delivery']),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderRequestForm = ({ isOpen, onClose }: OrderRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isTurksAndCaicos, country } = useLocationDetection();
  const { toast } = useToast();
  
  const total = getCartTotal();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      country: country || (isTurksAndCaicos ? 'Turks and Caicos' : ''),
      deliveryMethod: isTurksAndCaicos ? 'local_delivery' : 'shipping',
      paymentPreference: isTurksAndCaicos ? 'cash_on_delivery' : 'request_quote',
    }
  });

  const selectedDeliveryMethod = form.watch('deliveryMethod');
  const selectedPaymentPreference = form.watch('paymentPreference');

  const onSubmit = async (data: OrderFormData) => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
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
        subtotal: total.subtotal,
        shipping_cost: total.shipping,
        tax_amount: total.tax,
        total_amount: total.total,
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

      // Clear cart and show success
      clearCart();
      
      toast({
        title: "Order Submitted Successfully!",
        description: `Order #${order.order_number} has been submitted. We'll contact you soon with next steps.`
      });

      onClose();

      // If paying now, redirect to payment (would need Stripe integration)
      if (data.paymentPreference === 'pay_now') {
        // TODO: Integrate with Stripe for immediate payment
        // Redirect to payment would happen here
      }

    } catch (error: any) {
      console.error('Order submission error:', error);
      toast({
        title: "Order Submission Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDeliveryOptions = () => {
    if (isTurksAndCaicos) {
      return [
        { value: 'local_delivery', label: 'Local Delivery (Free for orders $50+)' },
        { value: 'pickup', label: 'Store Pickup' }
      ];
    } else {
      return [
        { value: 'shipping', label: 'International Shipping' }
      ];
    }
  };

  const getPaymentOptions = () => {
    const baseOptions = [
      { value: 'request_quote', label: 'Request Quote First' }
    ];

    if (isTurksAndCaicos) {
      baseOptions.unshift(
        { value: 'cash_on_delivery', label: 'Cash on Delivery' },
        { value: 'pay_now', label: 'Pay Online Now' }
      );
    } else {
      baseOptions.push(
        { value: 'pay_now', label: 'Pay Online Now' }
      );
    }

    return baseOptions;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Complete Your Order
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Form */}
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Location Indicator */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>
                        Detected Location: <strong>{country}</strong>
                        {isTurksAndCaicos && (
                          <Badge variant="secondary" className="ml-2">Local Customer</Badge>
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>

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
                            <Input {...field} />
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
                            <Input {...field} />
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
                          <Input type="email" {...field} />
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
                          <Input {...field} />
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
                          <Textarea {...field} rows={2} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  {isSubmitting ? 'Submitting...' : 
                   selectedPaymentPreference === 'pay_now' ? 'Submit Order & Pay' : 
                   'Submit Order Request'}
                </Button>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
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
                    <span>${total.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {total.shipping === 0 ? 'Free' : `$${total.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${total.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method Info */}
                {selectedPaymentPreference && (
                  <div className="p-4 bg-secondary/50 rounded-md">
                    <p className="text-sm font-medium mb-1">Payment Method:</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPaymentPreference === 'pay_now' && 'You will be redirected to secure payment processing.'}
                      {selectedPaymentPreference === 'cash_on_delivery' && 'Pay with cash when your order is delivered.'}
                      {selectedPaymentPreference === 'request_quote' && 'We will send you a detailed quote with payment options.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};