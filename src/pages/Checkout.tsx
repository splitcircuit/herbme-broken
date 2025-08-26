import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, CreditCard, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLocationDetection } from "@/components/shop/LocationDetector";
import { OrderRequestForm } from "@/components/shop/OrderRequestForm";
import { BankTransferModal } from "@/components/shop/BankTransferModal";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal } = useCart();
  const { 
    isTurksAndCaicos, 
    country, 
    isLoading,
  } = useLocationDetection();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showBankTransfer, setShowBankTransfer] = useState(false);

  const { subtotal, shipping, tax, total } = getCartTotal();

  // Redirect to cart if empty
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

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
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Payment Options */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location Badge */}
                <div className="mb-4">
                  <Badge 
                    variant={isTurksAndCaicos ? "default" : "outline"} 
                    className="flex items-center gap-1 w-fit"
                  >
                    <MapPin className="h-3 w-3" />
                    {isLoading ? 'Detecting location...' : country}
                    {isTurksAndCaicos && <span className="ml-1">• Local Customer</span>}
                  </Badge>
                </div>
                
                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}

                {/* Payment Options - Different based on location */}
                <div className="space-y-3 pt-4">
                  {isTurksAndCaicos ? (
                    <>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">
                        Choose your payment method:
                      </h3>
                      
                      {/* Request Order */}
                      <Button 
                        className="w-full justify-start" 
                        size="lg"
                        onClick={() => setShowOrderForm(true)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Request Order
                      </Button>
                      
                      {/* Bank Transfer */}
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        size="lg"
                        onClick={() => setShowBankTransfer(true)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Bank Transfer
                      </Button>
                      
                      {/* Pay Now */}
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        size="lg"
                        onClick={() => {
                          // TODO: Integrate Stripe for immediate payment
                          console.log('Redirect to Stripe payment');
                        }}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                      </Button>
                      
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        Local delivery available • Bank transfer preferred • Online payment option
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">
                        Secure online payment:
                      </h3>
                      
                      <Button 
                        className="w-full justify-start" 
                        size="lg"
                        onClick={() => {
                          // TODO: Integrate Stripe for immediate payment
                          console.log('Redirect to Stripe payment');
                        }}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                      </Button>
                      
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        International shipping • Secure online payment
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Order Request Form Modal */}
        <OrderRequestForm 
          isOpen={showOrderForm} 
          onClose={() => setShowOrderForm(false)} 
        />
        
        {/* Bank Transfer Modal */}
        <BankTransferModal 
          isOpen={showBankTransfer} 
          onClose={() => setShowBankTransfer(false)}
          orderTotal={total}
          orderNumber={`ORD-${Date.now()}`}
        />
      </div>
    </div>
  );
};

export default Checkout;