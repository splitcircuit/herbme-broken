import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Minus, Plus, Trash2, MapPin, CreditCard, FileText } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLocationDetection } from "@/components/shop/LocationDetector";
import { OrderRequestForm } from "@/components/shop/OrderRequestForm";
import { LocationConfirmationBar } from "@/components/shop/LocationConfirmationBar";
import { BankTransferModal } from "@/components/shop/BankTransferModal";

const Cart = () => {
  const { cartItems, addToCart, updateQuantity, removeItem, getCartTotal } = useCart();
  const { 
    isTurksAndCaicos, 
    country, 
    isLoading, 
    showConfirmationBar, 
    confirmLocation, 
    updateLocation, 
    dismissConfirmationBar 
  } = useLocationDetection();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showBankTransfer, setShowBankTransfer] = useState(false);

  // Recommended items that users can add manually
  const recommendedItems = [
    {
      id: 'rec-1',
      name: 'Watermelon Bombshell',
      price: 25,
      image: '/assets/product-1.jpg',
      type: 'product' as const,
      description: 'Refreshing summer glow oil'
    },
    {
      id: 'rec-2',
      name: 'Island Dream Oil',
      price: 28,
      image: '/assets/product-2.jpg', 
      type: 'product' as const,
      description: 'Tropical paradise scent'
    },
    {
      id: 'rec-3',
      name: 'Golden Hour Blend',
      price: 30,
      image: '/assets/product-3.jpg',
      type: 'product' as const,
      description: 'Perfect sunset glow'
    }
  ];

  const addToCartHandler = (item: typeof recommendedItems[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      type: item.type
    });
  };

  const { subtotal, shipping, tax, total } = getCartTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <ShoppingBag className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        </div>

        {/* Location Confirmation Bar */}
        <LocationConfirmationBar
          detectedLocation={{
            country,
            region: '',
            isTurksAndCaicos
          }}
          isLoading={isLoading}
          onLocationConfirm={(location) => confirmLocation(location)}
          onLocationChange={(location) => updateLocation(location)}
          isVisible={showConfirmationBar}
          onDismiss={dismissConfirmationBar}
        />

        {cartItems.length === 0 ? (
          <div className="space-y-8">
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add some amazing products to get started!</p>
                <Button asChild>
                  <a href="/shop">Continue Shopping</a>
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Items */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Bought Items</CardTitle>
                <CardDescription>Add these popular items to your cart</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-3">
                      <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-lg font-bold text-primary">${item.price}</p>
                      </div>
                      <Button 
                        onClick={() => addToCartHandler(item)}
                        className="w-full"
                        size="sm"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <Badge variant={item.type === 'custom_blend' ? 'secondary' : 'outline'}>
                            {item.type === 'custom_blend' ? 'Custom Blend' : 'Product'}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-primary mt-2">${item.price}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 min-w-[2rem] text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
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
                  
                  {shipping > 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}

                  {/* Checkout Buttons - Different based on location */}
                  <div className="space-y-2">
                    {isTurksAndCaicos ? (
                      <>
                        {/* Primary: Request Order for T&C customers */}
                        <Button 
                          className="w-full" 
                          size="lg"
                          onClick={() => setShowOrderForm(true)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Request Order
                        </Button>
                        
                        {/* Secondary: Pay Now option */}
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="lg"
                          onClick={() => {
                            // TODO: Integrate Stripe for immediate payment
                            console.log('Redirect to Stripe payment');
                          }}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay Online Now
                        </Button>
                        
                        <p className="text-xs text-muted-foreground text-center">
                          Local delivery available • Cash on delivery option
                        </p>
                      </>
                    ) : (
                      <>
                        {/* Primary: Pay Now for international customers */}
                        <Button 
                          className="w-full" 
                          size="lg"
                          onClick={() => {
                            // TODO: Integrate Stripe for immediate payment
                            console.log('Redirect to Stripe payment');
                          }}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay Now
                        </Button>
                        
                        {/* Secondary: Bank Transfer */}
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="lg"
                          onClick={() => setShowBankTransfer(true)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Bank Transfer
                        </Button>
                        
                        <p className="text-xs text-muted-foreground text-center">
                          International shipping • Secure online payment
                        </p>
                      </>
                    )}
                  </div>
                  
                  <Button variant="ghost" className="w-full" asChild>
                    <a href="/shop">Continue Shopping</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
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

export default Cart;