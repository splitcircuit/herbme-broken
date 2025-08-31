import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";
import { PAYPAL_SDK_OPTIONS } from "@/config/paypal";

interface PayPalProviderProps {
  children: ReactNode;
}

export const PayPalProvider = ({ children }: PayPalProviderProps) => {
  return (
    <PayPalScriptProvider options={PAYPAL_SDK_OPTIONS}>
      {children}
    </PayPalScriptProvider>
  );
};