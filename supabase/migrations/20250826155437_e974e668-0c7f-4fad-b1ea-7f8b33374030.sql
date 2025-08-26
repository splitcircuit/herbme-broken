-- Enable RLS on tables that don't have it enabled
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for the tables
-- Batches - typically admin only
CREATE POLICY "Batches are viewable by everyone" 
  ON public.batches 
  FOR SELECT 
  USING (true);

-- Inventory movements - typically admin only
CREATE POLICY "Inventory movements are viewable by everyone" 
  ON public.inventory_movements 
  FOR SELECT 
  USING (true);

-- Product details - should be publicly readable
CREATE POLICY "Product details are viewable by everyone" 
  ON public.product_details 
  FOR SELECT 
  USING (true);

-- Product media - should be publicly readable
CREATE POLICY "Product media is viewable by everyone" 
  ON public.product_media 
  FOR SELECT 
  USING (true);

-- Fix the search_path issue in the function
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;