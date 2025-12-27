// Oil Builder TypeScript contracts
// Used for support mode and normal builder flow

export type SupportGoal = 'calm' | 'barrier' | 'acne' | 'brighten';

export interface BaseOilSelection {
  name: string;
  percentage: number;
}

export interface OilFormulaDraft {
  baseOils: BaseOilSelection[];
  boostIngredients: string[];
  scent: string;
  goal?: SupportGoal;
  rationale?: string[];
}

export interface OilBuildContext {
  mode: 'normal' | 'support';
  scanId?: string;
  goal?: SupportGoal;
  profileFlags?: string[];
}

export interface BaseOilOption {
  name: string;
  benefits: string[];
  pricePerMl: number;
  allergens: string[];
  supportGoals: SupportGoal[];
}

export interface BoostOption {
  name: string;
  price: number;
  benefits: string[];
  allergens?: string[];
  supportGoals: SupportGoal[];
}

// Scent recommendation based on profile
export interface ScentRecommendation {
  scent: string;
  reason: string;
}
