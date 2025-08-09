-- Create quiz responses table
CREATE TABLE public.quiz_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  skincare_goals TEXT[],
  skin_type TEXT[],
  combination_areas TEXT,
  skincare_frequency TEXT,
  cleansing_feeling TEXT,
  skin_concerns TEXT[],
  product_preference TEXT,
  sun_exposure TEXT,
  active_ingredients TEXT[],
  routine_preference TEXT,
  allergies TEXT[],
  age_range TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom oil blends table
CREATE TABLE public.custom_oil_blends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  blend_name TEXT NOT NULL,
  base_oils JSONB NOT NULL,
  boost_ingredients TEXT[],
  scent TEXT,
  custom_scent TEXT,
  bottle_size TEXT NOT NULL,
  total_price DECIMAL(10,2),
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table for recommendations
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  skin_types TEXT[],
  skin_goals TEXT[],
  ingredients TEXT[],
  price DECIMAL(10,2),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz recommendations table
CREATE TABLE public.quiz_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_response_id UUID REFERENCES public.quiz_responses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_oil_blends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies for quiz_responses
CREATE POLICY "Users can view their own quiz responses" 
ON public.quiz_responses 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create quiz responses" 
ON public.quiz_responses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own quiz responses" 
ON public.quiz_responses 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for custom_oil_blends
CREATE POLICY "Users can view their own oil blends" 
ON public.custom_oil_blends 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own oil blends" 
ON public.custom_oil_blends 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own oil blends" 
ON public.custom_oil_blends 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own oil blends" 
ON public.custom_oil_blends 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for products (public read access)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- RLS policies for quiz_recommendations
CREATE POLICY "Users can view their quiz recommendations" 
ON public.quiz_recommendations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.quiz_responses 
    WHERE id = quiz_recommendation_id 
    AND (auth.uid() = user_id OR user_id IS NULL)
  )
);

CREATE POLICY "Anyone can create quiz recommendations" 
ON public.quiz_recommendations 
FOR INSERT 
WITH CHECK (true);

-- Insert sample products
INSERT INTO public.products (name, description, category, skin_types, skin_goals, ingredients, price, image_url) VALUES
('Sea Moss Gentle Cleanser', 'A nourishing cleanser infused with sea moss and aloe to gently remove impurities while maintaining skin barrier.', 'cleanser', ARRAY['dry', 'sensitive', 'normal'], ARRAY['hydrate', 'soothe'], ARRAY['sea moss', 'aloe vera', 'coconut oil'], 28.00, '/placeholder.svg'),
('Turmeric Brightening Toner', 'Brightening toner with turmeric and hibiscus to even skin tone and prep for treatment products.', 'toner', ARRAY['all'], ARRAY['brighten', 'fade dark spots'], ARRAY['turmeric', 'hibiscus', 'rose water'], 24.00, '/placeholder.svg'),
('Aloe Recovery Serum', 'Lightweight serum with concentrated aloe and vitamin E to calm irritation and provide deep hydration.', 'treatment', ARRAY['sensitive', 'irritated'], ARRAY['soothe', 'hydrate'], ARRAY['aloe vera', 'vitamin e', 'chamomile'], 35.00, '/placeholder.svg'),
('Sea Moss Daily Moisturizer', 'Rich daily moisturizer with sea moss and botanical oils to lock in moisture and strengthen skin barrier.', 'moisturizer', ARRAY['dry', 'normal'], ARRAY['hydrate', 'anti-aging'], ARRAY['sea moss', 'jojoba oil', 'shea butter'], 32.00, '/placeholder.svg'),
('Zinc Sun Shield SPF 30', 'Mineral sunscreen with zinc oxide and botanical extracts for daily protection without white cast.', 'spf', ARRAY['all'], ARRAY['protection'], ARRAY['zinc oxide', 'coconut oil', 'vitamin e'], 26.00, '/placeholder.svg'),
('Clarifying Clay Cleanser', 'Deep cleansing clay mask with activated charcoal and tea tree for oily and acne-prone skin.', 'cleanser', ARRAY['oily', 'combination'], ARRAY['reduce acne'], ARRAY['bentonite clay', 'tea tree', 'charcoal'], 30.00, '/placeholder.svg'),
('Vitamin C Glow Serum', 'Potent vitamin C serum with kakadu plum and rose hip to brighten and even skin tone.', 'treatment', ARRAY['all'], ARRAY['brighten', 'anti-aging'], ARRAY['vitamin c', 'kakadu plum', 'rose hip'], 42.00, '/placeholder.svg'),
('Night Repair Oil', 'Luxurious facial oil blend with rosehip and evening primrose for overnight skin renewal.', 'treatment', ARRAY['dry', 'mature'], ARRAY['anti-aging', 'hydrate'], ARRAY['rosehip oil', 'evening primrose', 'vitamin e'], 38.00, '/placeholder.svg');