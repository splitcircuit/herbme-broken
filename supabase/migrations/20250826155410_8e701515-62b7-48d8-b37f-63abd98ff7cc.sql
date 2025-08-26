-- Create orders table for flexible ordering system
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || FLOOR(RANDOM() * 1000)::TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  
  -- Order details
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  
  -- Order type and status
  order_type TEXT NOT NULL CHECK (order_type IN ('purchase', 'request', 'quote')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'quote_sent')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partial', 'refunded', 'not_required')),
  
  -- Location and delivery
  customer_location TEXT, -- 'turks_caicos', 'international', etc.
  delivery_method TEXT CHECK (delivery_method IN ('local_delivery', 'pickup', 'shipping', 'tbd')),
  delivery_notes TEXT,
  
  -- Payment details
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  payment_method TEXT,
  
  -- Admin notes and tracking
  admin_notes TEXT,
  tracking_number TEXT,
  estimated_delivery DATE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own orders" 
  ON public.orders 
  FOR SELECT 
  USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can create orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (true); -- Allow anyone to create orders (for guest orders)

CREATE POLICY "Users can update their own orders" 
  ON public.orders 
  FOR UPDATE 
  USING (user_id = auth.uid() OR email = auth.email());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at_trigger
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- Create index for performance
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_email ON public.orders(email);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_order_type ON public.orders(order_type);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);