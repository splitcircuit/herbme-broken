-- Create subscribers table for email marketing
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  source text DEFAULT 'HerbMe Site',
  tags text[] DEFAULT ARRAY['herbme','website'],
  preferences jsonb DEFAULT '{}',
  is_subscribed boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for newsletter signups
CREATE POLICY "Allow public newsletter signups" 
ON public.subscribers 
FOR INSERT 
TO public
WITH CHECK (true);

-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription"
ON public.subscribers
FOR SELECT
USING (email = auth.email() OR auth.uid()::text = ANY(tags));

-- Users can update their own subscription preferences
CREATE POLICY "Users can update their own subscription"
ON public.subscribers
FOR UPDATE
USING (email = auth.email() OR auth.uid()::text = ANY(tags));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_subscribers_updated_at();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON public.subscribers(source);
CREATE INDEX IF NOT EXISTS idx_subscribers_tags ON public.subscribers USING GIN(tags);