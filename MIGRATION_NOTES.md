# Skin Trigger Detection System (STDS) - Migration Notes

This document provides migration notes for the Skin Trigger Detection System feature, enabling easy export to Cursor/GitHub or other environments.

## Overview

The STDS is a standalone feature pillar that allows users to scan product ingredients and identify potential skin triggers. It works in guest mode without requiring account creation, quiz completion, or oil builder usage.

## Routes Created

| Route | Page Component | Description |
|-------|----------------|-------------|
| `/scan` | `Scan.tsx` | Main scanner with 3 input methods (paste, product search, barcode) |
| `/scan/result/:scanId` | `ScanResult.tsx` | Analysis results display with risk score, flags, and matched ingredients |
| `/scan-history` | `ScanHistory.tsx` | User's scan history (logged in) or localStorage history (guest) |
| `/ingredients` | `Ingredients.tsx` | Searchable ingredient database with category filters |
| `/ingredients/:slug` | `IngredientDetail.tsx` | Individual ingredient detail page |

## Database Tables Created

### `trigger_ingredients`
Stores the ingredient database with trigger information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Ingredient name (unique) |
| `slug` | text | URL-friendly slug (unique) |
| `aliases` | text[] | Alternative names for matching |
| `categories` | text[] | Trigger categories (irritant, allergen, etc.) |
| `severity` | integer | 1-3 severity rating |
| `notes` | text | Plain-language description |
| `common_products` | text[] | Product types where commonly found |
| `created_at` | timestamptz | Creation timestamp |

### `scan_events`
Stores individual scan events and their results.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key (used as scanId) |
| `user_id` | uuid | Optional user reference |
| `input_type` | text | 'paste', 'product', or 'barcode' |
| `product_id` | uuid | Optional product reference |
| `barcode` | text | Optional barcode string |
| `raw_ingredients_text` | text | Original input text |
| `result_json` | jsonb | Full analysis result |
| `created_at` | timestamptz | Scan timestamp |

### `skin_profiles`
Stores user skin profile preferences.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | User reference (unique) |
| `skin_type` | text | User's skin type |
| `flags` | text[] | Sensitivity flags |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last update timestamp |

### `issue_reports`
Stores user-submitted issue reports.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `scan_id` | uuid | Optional scan reference |
| `issue_type` | text | Type of issue reported |
| `message` | text | Issue description |
| `email` | text | Optional contact email |
| `created_at` | timestamptz | Submission timestamp |

## Edge Functions

### `scan-analyze`
**Location:** `supabase/functions/scan-analyze/index.ts`

**Endpoint:** `POST /functions/v1/scan-analyze`

**Request Body:**
```json
{
  "inputType": "paste" | "product" | "barcode",
  "ingredientsText": "string (for paste)",
  "productId": "uuid (for product lookup)",
  "barcode": "string (for barcode lookup)",
  "userId": "uuid (optional)"
}
```

**Response:**
```json
{
  "scanId": "uuid",
  "riskScore": 0-100,
  "riskTier": "low" | "moderate" | "high",
  "flags": [
    {
      "key": "category_key",
      "label": "Human Readable Label",
      "severity": 1-3,
      "matched": ["Ingredient 1", "Ingredient 2"]
    }
  ],
  "summary": ["Summary bullet 1", "Summary bullet 2"],
  "matchedIngredients": [
    {
      "name": "Ingredient Name",
      "slug": "ingredient-slug",
      "categories": ["category1", "category2"],
      "severity": 1-3,
      "notes": "Description",
      "matchedTerm": "Original matched term from input"
    }
  ],
  "disclaimer": "Educational only. Not medical advice."
}
```

## Components Created

| Component | Path | Description |
|-----------|------|-------------|
| `ReportIssueModal` | `src/components/scan/ReportIssueModal.tsx` | Modal for reporting scan issues |

## Files Modified

| File | Changes |
|------|---------|
| `src/App.tsx` | Added routes for scan pages |
| `src/components/ui/navigation.tsx` | Added "Scan" to main navigation |
| `supabase/config.toml` | Added `scan-analyze` function config |

## Environment Variables Required

The edge function uses these Supabase-provided variables (automatically available):

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database access

No additional secrets are required for the scan feature.

## Seed Data

The migration includes ~80 pre-seeded trigger ingredients covering:

- **Fragrances & Allergens:** Fragrance, Limonene, Linalool, Eugenol, etc.
- **Drying Alcohols:** Alcohol Denat, Isopropyl Alcohol, Ethanol
- **Harsh Surfactants:** SLS, SLES, Ammonium Lauryl Sulfate
- **Preservatives:** Methylisothiazolinone, Formaldehyde releasers, Parabens
- **Comedogenic Ingredients:** Coconut Oil, Isopropyl Myristate, Lanolin
- **Essential Oils:** Tea Tree, Lavender, Citrus oils
- **Active Acids:** Glycolic, Salicylic, Benzoyl Peroxide
- **Food Triggers:** High sugar, Dairy proteins, Artificial dyes
- **Sunscreen Filters:** Oxybenzone, Octinoxate
- **Physical Exfoliants:** Microbeads, Walnut shell

## Guest Mode Behavior

- Scans work without authentication
- Guest scans are stored in database with `user_id = null`
- Last 5 scan IDs are saved in `localStorage` under key `scanHistory`
- Guest history is accessible at `/scan-history`

## RLS Policies

All tables have Row-Level Security enabled:

- **trigger_ingredients:** Public read access, admin-only write
- **scan_events:** Public create, public read by ID
- **skin_profiles:** Users manage only their own profile
- **issue_reports:** Public create, admin-only read

## Running Locally After Export

1. Install dependencies: `npm install`
2. Set up Supabase project and run migrations
3. Deploy edge functions: `supabase functions deploy scan-analyze`
4. Update Supabase URL/keys in `src/integrations/supabase/client.ts`
5. Run development server: `npm run dev`

## Category Reference

| Key | Label | Description |
|-----|-------|-------------|
| `irritant` | Irritant | May cause skin irritation |
| `allergen` | Allergen | May trigger allergic reactions |
| `barrier_disruptor` | Barrier Disruptor | May damage skin barrier |
| `acne_trigger` | Acne Trigger | May worsen acne |
| `comedogenic` | Comedogenic | May clog pores |
| `sensitizer` | Sensitizer | May cause sensitization over time |
| `photosensitivity` | Photosensitivity | May increase sun sensitivity |
| `inflammation` | Inflammation | May promote inflammation |
| `glycation` | Glycation | May accelerate skin aging |
| `dairy` | Dairy | Dairy-derived, may affect hormonal acne |

## Future Enhancements (Stubs)

- Camera barcode scanning (currently manual entry only)
- Product database with typeahead search
- `/skin-profile` page for personalized analysis
- Integration with existing quiz results
