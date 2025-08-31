-- Add PayPal-specific fields to orders table
ALTER TABLE public.orders 
ADD COLUMN paypal_order_id text,
ADD COLUMN paypal_payer_id text,
ADD COLUMN paypal_capture_id text,
ADD COLUMN paypal_status text;

-- Update payment_method enum to include paypal
-- Note: We'll handle this in the application logic as enums are complex to alter