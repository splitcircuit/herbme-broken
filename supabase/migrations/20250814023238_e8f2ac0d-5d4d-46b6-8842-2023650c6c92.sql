-- Add inventory quantity column to products table
ALTER TABLE public.products 
ADD COLUMN inventory_quantity integer NOT NULL DEFAULT 0;

-- Update all existing products to have 100 units in stock
UPDATE public.products 
SET inventory_quantity = 100;