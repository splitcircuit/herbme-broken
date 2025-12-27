# HerbMe Ecosystem - Migration Notes

This document provides migration notes for the full HerbMe ecosystem, enabling easy export to Cursor/GitHub or other environments.

## Overview

HerbMe is an integrated skincare platform featuring:
- **Skin Intelligence Scanner** - Analyze product ingredients for skin triggers
- **Skin Profile** - Personalization hub for guest and logged-in users  
- **Custom Oil Builder** - Build personalized oil blends with optional scan-driven support mode
- **Skin Quiz** - Assess skin type and concerns with profile sync option
- **Shop** - Browse and purchase products

## Routes

| Route | Page Component | Description |
|-------|----------------|-------------|
| `/` | `Index.tsx` | Homepage |
| `/shop` | `Shop.tsx` | Product listing |
| `/product/:id` | `Product.tsx` | Product detail |
| `/cart` | `Cart.tsx` | Shopping cart |
| `/checkout` | `Checkout.tsx` | Checkout flow |
| `/scan` | `Scan.tsx` | Skin Intelligence Scanner |
| `/scan/result/:scanId` | `ScanResult.tsx` | Scan analysis results |
| `/scan-history` | `ScanHistory.tsx` | User's scan history |
| `/skin-profile` | `SkinProfile.tsx` | Skin profile management |
| `/quiz` | `Quiz.tsx` | Skin analysis quiz |
| `/build-oil` | `BuildOil.tsx` | Custom oil builder (supports `?mode=support&scanId=X&goal=Y`) |
| `/ingredients` | `Ingredients.tsx` | Ingredient database |
| `/ingredients/:slug` | `IngredientDetail.tsx` | Ingredient detail |
| `/auth` | `Auth.tsx` | Authentication |

## Shared Contracts (src/lib/contracts/)

| File | Exports | Purpose |
|------|---------|---------|
| `scan.ts` | `ScanResult`, `ScanFlag`, `MatchedIngredient` | Scan result types |
| `profile.ts` | `SkinProfile`, `SkinType`, `SkinFlag`, `ProfileOverlay` | Profile types |
| `oil.ts` | `OilFormulaDraft`, `SupportGoal`, `OilBuildContext` | Oil builder types |
| `products.ts` | `ShopProductLocal`, `CatalogProductDB`, `CartItem` | Product types |

## Deterministic Rulesets (src/lib/rules/)

| File | Function | Purpose |
|------|----------|---------|
| `profileNormalizer.ts` | `normalizeQuizToProfile()` | Convert quiz data → SkinProfile |
| `profileRiskOverlay.ts` | `getProfileOverlay()` | Add personalized warnings to scan results |
| `scanFlagToGoals.ts` | `getRecommendedGoal()` | Map scan flags → oil builder goals |
| `oilPrefillRules.ts` | `generateOilPrefill()` | Generate OilFormulaDraft from scan + profile |

## localStorage Keys (src/lib/storage.ts)

All keys use `herbme.` prefix:

| Key | Content |
|-----|---------|
| `herbme.cart` | Cart items array |
| `herbme.skinProfile` | Guest skin profile |
| `herbme.scanHistory` | Recent scan IDs (guest) |
| `herbme.wishlist` | Wishlist product IDs |
| `herbme.recentlyViewed` | Recently viewed products |
| `herbme.userLocation` | User location preference |

## Database Tables

### Core Tables
- `products` - Product catalog
- `scan_events` - Scan results storage
- `trigger_ingredients` - Ingredient database
- `skin_profiles` - User skin profiles
- `quiz_responses` - Quiz submissions
- `custom_oil_blends` - Saved custom blends
- `orders` - Order records

### Key Relationships
- `scan_events.user_id` → optional auth user
- `skin_profiles.user_id` → auth user (unique)
- `quiz_responses.user_id` → auth user

## Edge Functions

### `scan-analyze`
- **Path:** `supabase/functions/scan-analyze/index.ts`
- **Auth:** Public (no JWT required)
- **Input:** `{ inputType, ingredientsText?, barcode?, userId? }`
- **Output:** `{ scanId, riskScore, riskTier, flags, summary, matchedIngredients }`

## Guest vs Logged-In Behavior

| Feature | Guest | Logged In |
|---------|-------|-----------|
| Scan | ✅ Works, saved to DB | ✅ Linked to user |
| Scan History | localStorage (5 max) | Supabase (unlimited) |
| Skin Profile | localStorage | Supabase |
| Quiz | ❌ Requires auth | ✅ Saved to DB |
| Oil Builder | ✅ Works | ✅ Can save blends |
| Cart | localStorage | localStorage |
| Profile Sync | — | Prompt on login if guest profile exists |

## Profile Sync Flow

1. Guest creates profile (saved to localStorage)
2. Guest logs in or signs up
3. `SkinProfileContext` detects guest profile exists
4. Shows `ProfileSyncModal`: "Save your Skin Profile to your account?"
5. If confirmed, upserts to `skin_profiles` table
6. Clears localStorage profile

## Running Locally

1. `npm install`
2. Copy `.env.example` to `.env` and configure
3. Run Supabase migrations
4. Deploy edge functions: `supabase functions deploy scan-analyze`
5. `npm run dev`

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Key Design Decisions

1. **Guest-first philosophy** - All features work without login where possible
2. **Deterministic logic only** - No AI for prefills/recommendations, uses rulesets
3. **Scanner independence** - Works standalone, no profile/quiz required
4. **Progressive personalization** - Profile enhances but doesn't block features
5. **Dual product sources** - Shop uses local products.ts, scanner uses DB catalog
