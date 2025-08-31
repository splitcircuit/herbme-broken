import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Copy, CheckCircle, Building, CreditCard, Hash, Globe } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BankTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
  orderNumber?: string;
}

export const BankTransferModal = ({ isOpen, onClose, orderTotal, orderNumber }: BankTransferModalProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const bankDetails = {
    bankName: "FirstCaribbean International Bank",
    accountName: "HerbMe Natural Products",
    accountNumber: "123-456-7890",
    routingNumber: "123456789",
    swiftCode: "FCIB TC TK",
    institutionNumber: "001"
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast({
        title: "Copied!",
        description: `${fieldName} copied to clipboard`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the details manually",
        variant: "destructive"
      });
    }
  };

  const BankDetailRow = ({ 
    icon: Icon, 
    label, 
    value, 
    fieldName 
  }: { 
    icon: any, 
    label: string, 
    value: string, 
    fieldName: string 
  }) => (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{value}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyToClipboard(value, fieldName)}
        className="h-8 w-8 p-0"
      >
        {copiedField === fieldName ? (
          <CheckCircle className="h-4 w-4 text-success" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Bank Transfer Details
          </DialogTitle>
          <DialogDescription>
            Complete your payment using bank transfer or e-transfer with the details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Order Total:</span>
                <span className="font-semibold text-lg">${orderTotal.toFixed(2)} USD</span>
              </div>
              {orderNumber && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Reference:</span>
                  <span>{orderNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bank Transfer Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Use these details for your bank transfer or e-transfer
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <BankDetailRow
                icon={Building}
                label="Bank Name"
                value={bankDetails.bankName}
                fieldName="Bank Name"
              />
              
              <BankDetailRow
                icon={CreditCard}
                label="Account Name"
                value={bankDetails.accountName}
                fieldName="Account Name"
              />
              
              <BankDetailRow
                icon={Hash}
                label="Account Number"
                value={bankDetails.accountNumber}
                fieldName="Account Number"
              />
              
              <BankDetailRow
                icon={Hash}
                label="Routing Number"
                value={bankDetails.routingNumber}
                fieldName="Routing Number"
              />
              
              <BankDetailRow
                icon={Globe}
                label="SWIFT Code"
                value={bankDetails.swiftCode}
                fieldName="SWIFT Code"
              />
              
              <BankDetailRow
                icon={Hash}
                label="Institution Number"
                value={bankDetails.institutionNumber}
                fieldName="Institution Number"
              />
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Important Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <p className="font-medium">For E-Transfer (Interac):</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Use the account name exactly as shown above</li>
                  <li>Include your phone number from the order form in the message field</li>
                  <li>No security question required</li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="font-medium">For Wire Transfer:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Include all bank details as provided</li>
                  <li>Use your phone number from the order form in the reference field</li>
                  <li>Allow 1-3 business days for processing</li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="p-3 bg-accent/20 rounded-lg">
                <p className="font-medium text-accent-foreground">
                  💡 Payment Reference: Use your phone number from the order form
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This helps us match your payment to your order quickly and accurately.
                </p>
              </div>
              
              <div className="p-3 bg-accent/20 rounded-lg mt-3">
                <p className="font-medium text-accent-foreground">
                  📧 After completing your transfer, please email us at orders@herbme.tc with:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 ml-4">
                  <li>Your phone number (same as used in transfer reference)</li>
                  <li>Transfer confirmation/receipt</li>
                  <li>Transfer date and amount</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              I'll Pay Later
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Bank details copied!",
                  description: "Complete your transfer and email us the confirmation",
                });
                onClose();
              }}
              className="flex-1"
            >
              Got It, Proceeding with Transfer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};