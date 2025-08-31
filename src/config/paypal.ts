// PayPal configuration
export const PAYPAL_CONFIG = {
  clientId: "AW8Q3jgf7FoVjqoFQ5Cl7hwcDKfE8Ed4REmTNhd-X7-JJJr_6b_3CKJsGLF-42_Pz6E3lzKMY1Vqz1Kg", // Replace with your PayPal Client ID
  currency: "USD",
  intent: "capture",
  enableFunding: "venmo,paylater",
  disableFunding: "credit,card",
  locale: "en_US"
} as const;

// PayPal SDK options
export const PAYPAL_SDK_OPTIONS = {
  clientId: PAYPAL_CONFIG.clientId,
  currency: PAYPAL_CONFIG.currency,
  intent: PAYPAL_CONFIG.intent,
  components: "buttons,funding-eligibility",
  locale: PAYPAL_CONFIG.locale,
  enableFunding: PAYPAL_CONFIG.enableFunding,
  disableFunding: PAYPAL_CONFIG.disableFunding,
  dataClientToken: undefined,
  debug: false
};

export type PayPalOrderData = {
  id: string;
  status: string;
  payment_source?: any;
  payer?: {
    payer_id?: string;
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  purchase_units?: Array<{
    amount?: {
      currency_code?: string;
      value?: string;
    };
    payments?: {
      captures?: Array<{
        id?: string;
        status?: string;
      }>;
    };
  }>;
};