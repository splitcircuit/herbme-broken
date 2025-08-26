import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Copy, ArrowRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCopyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      toast({
        title: "Order Number Copied!",
        description: "You can use this to track your order.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Received! 🎉</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your order! We're excited to get your natural skincare products to you.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order Number */}
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-mono text-lg font-semibold">#{orderNumber}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyOrderNumber}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>

            <Separator />

            {/* Next Steps */}
            <div className="space-y-3">
              <h3 className="font-semibold">What happens next?</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">1</Badge>
                  <p>We'll review your order and confirm availability within 24 hours</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">2</Badge>
                  <p>You'll receive an email with delivery details and payment instructions</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">3</Badge>
                  <p>Your handcrafted products will be prepared and delivered fresh</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div className="text-sm">
              <p className="font-medium mb-1">Questions about your order?</p>
              <p className="text-muted-foreground">
                Contact us at <span className="font-medium">hello@naturalessence.tc</span> or reference order #{orderNumber}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate('/shop')}
            className="flex-1 flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex-1"
          >
            Back to Home
          </Button>
        </div>

        {/* Thank You Message */}
        <div className="text-center mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">
            Thank you for choosing <span className="font-semibold text-primary">Natural Essence</span> 
            for your skincare journey. We can't wait to help you achieve naturally radiant skin! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;