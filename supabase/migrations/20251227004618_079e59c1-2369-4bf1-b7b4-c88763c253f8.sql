-- Create trigger_ingredients table (separate from existing products table)
CREATE TABLE public.trigger_ingredients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  aliases text[] DEFAULT '{}',
  categories text[] DEFAULT '{}',
  severity integer NOT NULL DEFAULT 1 CHECK (severity >= 1 AND severity <= 3),
  notes text,
  common_products text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create scan_events table
CREATE TABLE public.scan_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  input_type text NOT NULL CHECK (input_type IN ('paste', 'product', 'barcode')),
  product_id uuid,
  barcode text,
  raw_ingredients_text text,
  result_json jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create skin_profiles table
CREATE TABLE public.skin_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  skin_type text,
  flags text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create issue_reports table for "Report an issue"
CREATE TABLE public.issue_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id uuid REFERENCES public.scan_events(id) ON DELETE SET NULL,
  issue_type text NOT NULL,
  message text NOT NULL,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.trigger_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trigger_ingredients (public read)
CREATE POLICY "Anyone can view trigger ingredients" ON public.trigger_ingredients
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage trigger ingredients" ON public.trigger_ingredients
  FOR ALL USING (is_admin());

-- RLS Policies for scan_events (anyone can create, users see their own)
CREATE POLICY "Anyone can create scan events" ON public.scan_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own scans" ON public.scan_events
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anyone can view scans by ID" ON public.scan_events
  FOR SELECT USING (true);

-- RLS Policies for skin_profiles
CREATE POLICY "Users can manage their own skin profile" ON public.skin_profiles
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for issue_reports (anyone can submit)
CREATE POLICY "Anyone can submit issue reports" ON public.issue_reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view issue reports" ON public.issue_reports
  FOR SELECT USING (is_admin());

-- Create indexes for performance
CREATE INDEX idx_trigger_ingredients_slug ON public.trigger_ingredients(slug);
CREATE INDEX idx_trigger_ingredients_categories ON public.trigger_ingredients USING GIN(categories);
CREATE INDEX idx_scan_events_user_id ON public.scan_events(user_id);
CREATE INDEX idx_scan_events_created_at ON public.scan_events(created_at DESC);

-- Seed trigger_ingredients with ~80 common skin triggers
INSERT INTO public.trigger_ingredients (name, slug, aliases, categories, severity, notes, common_products) VALUES
-- Fragrances & Allergens (High severity)
('Fragrance', 'fragrance', ARRAY['Parfum', 'Perfume', 'Aroma'], ARRAY['irritant', 'allergen'], 3, 'Umbrella term for hundreds of undisclosed chemicals. Major cause of contact dermatitis.', ARRAY['skincare', 'bodycare', 'haircare']),
('Limonene', 'limonene', ARRAY['D-Limonene', 'Citrus Limonene'], ARRAY['irritant', 'allergen'], 2, 'Citrus-derived fragrance component. Oxidizes and becomes sensitizing over time.', ARRAY['skincare', 'cleaning products']),
('Linalool', 'linalool', ARRAY['Linalyl Alcohol'], ARRAY['irritant', 'allergen'], 2, 'Floral fragrance compound found in lavender. Common allergen when oxidized.', ARRAY['skincare', 'bodycare']),
('Citronellol', 'citronellol', ARRAY['Beta-Citronellol'], ARRAY['irritant', 'allergen'], 2, 'Rose-scented fragrance ingredient. Can cause sensitization.', ARRAY['skincare', 'bodycare']),
('Geraniol', 'geraniol', ARRAY['Trans-Geraniol'], ARRAY['irritant', 'allergen'], 2, 'Rose/geranium fragrance. Known skin sensitizer.', ARRAY['skincare', 'bodycare']),
('Eugenol', 'eugenol', ARRAY['Clove Oil'], ARRAY['irritant', 'allergen'], 3, 'Spicy fragrance from clove. Strong potential for sensitization.', ARRAY['oral care', 'skincare']),
('Cinnamal', 'cinnamal', ARRAY['Cinnamic Aldehyde', 'Cinnamaldehyde'], ARRAY['irritant', 'allergen'], 3, 'Cinnamon fragrance. High sensitization potential.', ARRAY['oral care', 'skincare']),
('Coumarin', 'coumarin', ARRAY['Tonka Bean'], ARRAY['irritant', 'allergen'], 2, 'Sweet vanilla-like fragrance. Moderate sensitizer.', ARRAY['skincare', 'bodycare']),

-- Drying Alcohols
('Alcohol Denat', 'alcohol-denat', ARRAY['Denatured Alcohol', 'SD Alcohol', 'Alcohol Denat.'], ARRAY['irritant', 'barrier_disruptor'], 3, 'Denatured alcohol that strips natural oils and damages skin barrier. Very drying.', ARRAY['toners', 'astringents', 'haircare']),
('Isopropyl Alcohol', 'isopropyl-alcohol', ARRAY['Isopropanol', 'Rubbing Alcohol', 'IPA'], ARRAY['irritant', 'barrier_disruptor'], 3, 'Strong solvent that is very drying and can damage skin barrier.', ARRAY['toners', 'antiseptics']),
('Ethanol', 'ethanol', ARRAY['Ethyl Alcohol', 'Grain Alcohol'], ARRAY['irritant', 'barrier_disruptor'], 2, 'Can be drying in high concentrations. Disrupts skin barrier.', ARRAY['toners', 'hand sanitizers']),
('Methanol', 'methanol', ARRAY['Methyl Alcohol', 'Wood Alcohol'], ARRAY['irritant', 'barrier_disruptor'], 3, 'Toxic alcohol, should not be in cosmetics. Severe irritant.', ARRAY['industrial']),

-- Harsh Surfactants
('Sodium Lauryl Sulfate', 'sodium-lauryl-sulfate', ARRAY['SLS', 'Sodium Dodecyl Sulfate'], ARRAY['irritant', 'barrier_disruptor'], 3, 'Harsh surfactant that strips natural oils. Major cause of irritation.', ARRAY['cleansers', 'shampoos', 'toothpaste']),
('Sodium Laureth Sulfate', 'sodium-laureth-sulfate', ARRAY['SLES', 'Sodium Lauryl Ether Sulfate'], ARRAY['irritant', 'barrier_disruptor'], 2, 'Milder than SLS but still can be drying and irritating for sensitive skin.', ARRAY['cleansers', 'shampoos']),
('Ammonium Lauryl Sulfate', 'ammonium-lauryl-sulfate', ARRAY['ALS'], ARRAY['irritant', 'barrier_disruptor'], 2, 'Similar to SLS, can strip natural oils and cause irritation.', ARRAY['shampoos', 'cleansers']),
('Cocamidopropyl Betaine', 'cocamidopropyl-betaine', ARRAY['CAPB'], ARRAY['allergen'], 1, 'Generally mild but can cause contact dermatitis in some individuals.', ARRAY['cleansers', 'shampoos']),

-- Preservatives
('Methylisothiazolinone', 'methylisothiazolinone', ARRAY['MI', 'MIT', 'Kathon CG'], ARRAY['irritant', 'allergen'], 3, 'Potent preservative linked to high rates of contact allergies. Banned in leave-on products in EU.', ARRAY['skincare', 'haircare', 'cleaning']),
('Methylchloroisothiazolinone', 'methylchloroisothiazolinone', ARRAY['MCI', 'Kathon'], ARRAY['irritant', 'allergen'], 3, 'Often paired with MI. Strong sensitizer, restricted in many regions.', ARRAY['skincare', 'cleaning']),
('Formaldehyde', 'formaldehyde', ARRAY['Formalin', 'Methanal'], ARRAY['irritant', 'allergen', 'sensitizer'], 3, 'Known carcinogen and strong sensitizer. Should be avoided.', ARRAY['nail products', 'hair straighteners']),
('DMDM Hydantoin', 'dmdm-hydantoin', ARRAY['Glydant'], ARRAY['irritant', 'allergen'], 3, 'Formaldehyde-releasing preservative. Potential sensitizer.', ARRAY['shampoos', 'conditioners']),
('Imidazolidinyl Urea', 'imidazolidinyl-urea', ARRAY['Germall 115'], ARRAY['irritant', 'allergen'], 2, 'Formaldehyde releaser. Can cause contact dermatitis.', ARRAY['skincare', 'bodycare']),
('Diazolidinyl Urea', 'diazolidinyl-urea', ARRAY['Germall II'], ARRAY['irritant', 'allergen'], 2, 'Formaldehyde-releasing preservative. Sensitization risk.', ARRAY['skincare', 'bodycare']),
('Quaternium-15', 'quaternium-15', ARRAY['Dowicil'], ARRAY['irritant', 'allergen'], 3, 'Releases formaldehyde. One of the most common causes of cosmetic contact dermatitis.', ARRAY['skincare', 'haircare']),
('Phenoxyethanol', 'phenoxyethanol', ARRAY['2-Phenoxyethanol'], ARRAY['irritant'], 1, 'Generally safe preservative but can irritate sensitive skin in high concentrations.', ARRAY['skincare', 'bodycare']),

-- Comedogenic Oils & Ingredients
('Coconut Oil', 'coconut-oil', ARRAY['Cocos Nucifera Oil', 'Coconut Butter'], ARRAY['acne_trigger', 'comedogenic'], 2, 'Highly comedogenic (rating 4/5). Can clog pores and cause breakouts.', ARRAY['skincare', 'haircare', 'food']),
('Wheat Germ Oil', 'wheat-germ-oil', ARRAY['Triticum Vulgare Germ Oil'], ARRAY['acne_trigger', 'comedogenic'], 3, 'Very comedogenic (rating 5/5). High in vitamin E but clogs pores.', ARRAY['skincare']),
('Isopropyl Myristate', 'isopropyl-myristate', ARRAY['IPM'], ARRAY['acne_trigger', 'comedogenic'], 3, 'Highly comedogenic emollient. Common cause of acne.', ARRAY['skincare', 'makeup']),
('Isopropyl Palmitate', 'isopropyl-palmitate', ARRAY['IPP'], ARRAY['acne_trigger', 'comedogenic'], 3, 'Highly comedogenic ester. Can cause breakouts.', ARRAY['skincare', 'sunscreen']),
('Lanolin', 'lanolin', ARRAY['Wool Wax', 'Wool Grease', 'Lanolin Alcohol'], ARRAY['acne_trigger', 'allergen', 'comedogenic'], 2, 'Comedogenic and can cause allergic reactions in some people.', ARRAY['lip balms', 'moisturizers']),
('Algae Extract', 'algae-extract', ARRAY['Seaweed Extract', 'Alaria Esculenta'], ARRAY['acne_trigger', 'comedogenic'], 2, 'Can be comedogenic. May clog pores in some formulations.', ARRAY['skincare']),
('Squalane', 'squalane', ARRAY['Squalene'], ARRAY['acne_trigger'], 1, 'Generally non-comedogenic but olive-derived versions may cause issues.', ARRAY['skincare', 'oils']),

-- Essential Oils that can sensitize
('Tea Tree Oil', 'tea-tree-oil', ARRAY['Melaleuca Alternifolia Oil', 'TTO'], ARRAY['irritant', 'allergen'], 2, 'Beneficial in low concentrations but can sensitize over time.', ARRAY['skincare', 'acne treatments']),
('Lavender Oil', 'lavender-oil', ARRAY['Lavandula Angustifolia Oil'], ARRAY['irritant', 'allergen', 'photosensitivity'], 2, 'Contains linalool. Can cause sensitization with repeated use.', ARRAY['skincare', 'bodycare']),
('Peppermint Oil', 'peppermint-oil', ARRAY['Mentha Piperita Oil'], ARRAY['irritant'], 2, 'Cooling but can be irritating. Contains menthol which may sensitize.', ARRAY['oral care', 'skincare']),
('Citrus Oils', 'citrus-oils', ARRAY['Orange Oil', 'Lemon Oil', 'Grapefruit Oil', 'Bergamot Oil'], ARRAY['irritant', 'photosensitivity'], 3, 'Phototoxic - can cause burns and dark spots with sun exposure.', ARRAY['skincare', 'bodycare']),
('Eucalyptus Oil', 'eucalyptus-oil', ARRAY['Eucalyptus Globulus Oil'], ARRAY['irritant'], 2, 'Strong essential oil that can irritate sensitive skin.', ARRAY['skincare', 'bodycare']),
('Cinnamon Oil', 'cinnamon-oil', ARRAY['Cinnamomum Zeylanicum Oil'], ARRAY['irritant', 'allergen'], 3, 'Highly irritating essential oil. Strong sensitizer.', ARRAY['oral care', 'skincare']),

-- Acids (context-dependent)
('Glycolic Acid', 'glycolic-acid', ARRAY['Hydroxyacetic Acid'], ARRAY['irritant', 'photosensitivity'], 2, 'Effective AHA but can irritate. Increases sun sensitivity.', ARRAY['exfoliants', 'serums']),
('Salicylic Acid', 'salicylic-acid', ARRAY['BHA', 'Beta Hydroxy Acid'], ARRAY['irritant'], 1, 'Can be drying. Usually well-tolerated but may irritate sensitive skin.', ARRAY['acne treatments', 'exfoliants']),
('Lactic Acid', 'lactic-acid', ARRAY['Alpha Hydroxy Acid'], ARRAY['irritant', 'photosensitivity'], 1, 'Milder AHA but still increases sun sensitivity.', ARRAY['exfoliants', 'serums']),
('Benzoyl Peroxide', 'benzoyl-peroxide', ARRAY['BPO'], ARRAY['irritant', 'barrier_disruptor'], 2, 'Effective for acne but very drying and can cause peeling.', ARRAY['acne treatments']),

-- Retinoids
('Retinol', 'retinol', ARRAY['Vitamin A', 'Retinyl Palmitate'], ARRAY['irritant', 'photosensitivity'], 2, 'Can cause irritation, peeling, dryness. Increases sun sensitivity.', ARRAY['anti-aging', 'serums']),
('Retinaldehyde', 'retinaldehyde', ARRAY['Retinal'], ARRAY['irritant', 'photosensitivity'], 2, 'Stronger than retinol. Higher irritation potential.', ARRAY['anti-aging']),

-- Dyes & Colorants
('FD&C Red 40', 'fdc-red-40', ARRAY['Red 40', 'Allura Red', 'E129'], ARRAY['irritant', 'allergen', 'sensitizer'], 2, 'Synthetic dye linked to allergic reactions.', ARRAY['food', 'cosmetics']),
('FD&C Yellow 5', 'fdc-yellow-5', ARRAY['Yellow 5', 'Tartrazine', 'E102'], ARRAY['irritant', 'allergen', 'sensitizer'], 2, 'Synthetic dye that can cause allergic reactions.', ARRAY['food', 'cosmetics']),
('FD&C Yellow 6', 'fdc-yellow-6', ARRAY['Yellow 6', 'Sunset Yellow', 'E110'], ARRAY['irritant', 'allergen', 'sensitizer'], 2, 'Synthetic dye linked to hypersensitivity.', ARRAY['food', 'cosmetics']),
('FD&C Blue 1', 'fdc-blue-1', ARRAY['Blue 1', 'Brilliant Blue', 'E133'], ARRAY['sensitizer'], 1, 'Synthetic dye, generally considered safe but may sensitize.', ARRAY['food', 'cosmetics']),

-- Silicones (can trap irritants)
('Dimethicone', 'dimethicone', ARRAY['Polydimethylsiloxane', 'PDMS'], ARRAY['acne_trigger'], 1, 'Can trap other ingredients under skin. May worsen acne for some.', ARRAY['skincare', 'haircare']),
('Cyclomethicone', 'cyclomethicone', ARRAY['Cyclopentasiloxane', 'D5'], ARRAY['acne_trigger'], 1, 'Volatile silicone. Can contribute to breakouts in some people.', ARRAY['skincare', 'haircare']),

-- Food-Related Triggers
('High Fructose Corn Syrup', 'high-fructose-corn-syrup', ARRAY['HFCS', 'Corn Syrup', 'Glucose-Fructose'], ARRAY['inflammation', 'glycation'], 3, 'High sugar linked to inflammation and accelerated skin aging through glycation.', ARRAY['food', 'beverages']),
('Sugar', 'sugar', ARRAY['Sucrose', 'Glucose', 'Fructose', 'Dextrose'], ARRAY['inflammation', 'glycation'], 2, 'Excess sugar consumption linked to inflammation and glycation damage.', ARRAY['food', 'beverages']),
('Whey Protein', 'whey-protein', ARRAY['Whey', 'Whey Concentrate', 'Whey Isolate'], ARRAY['acne_trigger', 'dairy'], 2, 'Dairy-derived protein linked to increased acne in some individuals.', ARRAY['food', 'supplements']),
('Casein', 'casein', ARRAY['Milk Protein', 'Sodium Caseinate'], ARRAY['acne_trigger', 'dairy'], 2, 'Dairy protein that may trigger acne through hormonal pathways.', ARRAY['food', 'supplements']),
('Skim Milk', 'skim-milk', ARRAY['Non-Fat Milk', 'Fat-Free Milk'], ARRAY['acne_trigger', 'dairy'], 2, 'Skim milk has stronger association with acne than whole milk.', ARRAY['food', 'beverages']),
('Artificial Sweeteners', 'artificial-sweeteners', ARRAY['Aspartame', 'Sucralose', 'Saccharin', 'Acesulfame K'], ARRAY['inflammation'], 1, 'May disrupt gut microbiome affecting skin health indirectly.', ARRAY['food', 'beverages']),

-- Mineral/UV Filters
('Oxybenzone', 'oxybenzone', ARRAY['Benzophenone-3', 'BP-3'], ARRAY['allergen', 'sensitizer'], 2, 'Chemical sunscreen linked to allergic reactions and hormone disruption.', ARRAY['sunscreen']),
('Octinoxate', 'octinoxate', ARRAY['Octyl Methoxycinnamate', 'OMC'], ARRAY['allergen'], 1, 'Chemical UV filter with some sensitization potential.', ARRAY['sunscreen']),
('Avobenzone', 'avobenzone', ARRAY['Butyl Methoxydibenzoylmethane'], ARRAY['allergen'], 1, 'Can degrade in sun and cause irritation in some people.', ARRAY['sunscreen']),

-- Metals
('Nickel', 'nickel', ARRAY['Nickel Sulfate'], ARRAY['allergen', 'sensitizer'], 3, 'Common metal allergen. Found in some cosmetics as contaminant.', ARRAY['jewelry', 'cosmetics']),
('Cobalt', 'cobalt', ARRAY['Cobalt Chloride'], ARRAY['allergen', 'sensitizer'], 2, 'Metal allergen often co-occurs with nickel allergy.', ARRAY['cosmetics', 'jewelry']),

-- Misc Irritants
('Menthol', 'menthol', ARRAY['Mint Extract', 'Peppermint Extract'], ARRAY['irritant'], 2, 'Provides cooling sensation but can irritate and sensitize skin.', ARRAY['lip balms', 'skincare']),
('Camphor', 'camphor', ARRAY['Cinnamomum Camphora'], ARRAY['irritant'], 2, 'Provides tingling but can be irritating to sensitive skin.', ARRAY['lip balms', 'muscle rubs']),
('Witch Hazel', 'witch-hazel', ARRAY['Hamamelis Virginiana'], ARRAY['irritant', 'barrier_disruptor'], 2, 'Natural astringent but often contains alcohol. Can be drying.', ARRAY['toners', 'cleansers']),
('Sodium Hydroxide', 'sodium-hydroxide', ARRAY['Lye', 'Caustic Soda', 'NaOH'], ARRAY['irritant'], 2, 'pH adjuster. Generally safe in finished products but can irritate.', ARRAY['soap', 'skincare']),
('Propylene Glycol', 'propylene-glycol', ARRAY['PG', '1,2-Propanediol'], ARRAY['irritant', 'allergen'], 1, 'Common humectant that can cause reactions in sensitive individuals.', ARRAY['skincare', 'food']),
('Sodium Benzoate', 'sodium-benzoate', ARRAY['Benzoate of Soda', 'E211'], ARRAY['irritant'], 1, 'Preservative that may cause hives or irritation in sensitive people.', ARRAY['food', 'beverages', 'skincare']),
('Parabens', 'parabens', ARRAY['Methylparaben', 'Propylparaben', 'Butylparaben', 'Ethylparaben'], ARRAY['allergen'], 1, 'Preservatives with low but documented sensitization risk.', ARRAY['skincare', 'bodycare']),
('Triclosan', 'triclosan', ARRAY['Microban'], ARRAY['irritant', 'barrier_disruptor'], 2, 'Antibacterial agent linked to skin irritation. Banned in many products.', ARRAY['soap', 'toothpaste']),

-- Physical Exfoliants
('Microbeads', 'microbeads', ARRAY['Polyethylene', 'Polypropylene Beads'], ARRAY['irritant'], 2, 'Plastic exfoliant beads. Can cause micro-tears. Banned in many regions.', ARRAY['scrubs', 'cleansers']),
('Walnut Shell Powder', 'walnut-shell-powder', ARRAY['Juglans Regia Shell Powder'], ARRAY['irritant'], 2, 'Jagged particles can cause micro-tears in skin.', ARRAY['scrubs']),
('Apricot Kernel', 'apricot-kernel', ARRAY['Prunus Armeniaca Seed Powder'], ARRAY['irritant'], 2, 'Sharp particles that can damage skin with scrubbing.', ARRAY['scrubs']),

-- Additional common triggers
('Sodium Chloride', 'sodium-chloride', ARRAY['Salt', 'Sea Salt', 'Table Salt'], ARRAY['irritant'], 1, 'Can be drying and irritating in high concentrations.', ARRAY['scrubs', 'sprays']),
('Talc', 'talc', ARRAY['Talcum', 'Magnesium Silicate'], ARRAY['irritant'], 1, 'Can be drying. Historical concerns about asbestos contamination.', ARRAY['powders', 'makeup']),
('Bismuth Oxychloride', 'bismuth-oxychloride', ARRAY['CI 77163'], ARRAY['irritant'], 2, 'Mineral pigment that causes itching and irritation for many.', ARRAY['makeup', 'mineral cosmetics']),
('Synthetic Musk', 'synthetic-musk', ARRAY['Musk Ketone', 'Musk Xylene', 'Galaxolide'], ARRAY['irritant', 'allergen'], 2, 'Synthetic fragrance compounds with sensitization potential.', ARRAY['perfume', 'bodycare']);
