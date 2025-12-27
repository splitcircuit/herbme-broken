// Skin Profile TypeScript contracts
// Canonical profile shape used throughout the app

export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';

export type SkinFlag = 
  | 'fragrance_sensitive'
  | 'acne_prone'
  | 'eczema_prone'
  | 'hyperpigmentation_concern'
  | 'allergy_prone'
  | 'rosacea_prone'
  | 'aging_concern'
  | 'dehydration_prone'
  | 'sun_sensitive';

export interface SkinProfile {
  skinType: SkinType;
  flags: SkinFlag[];
  allergies?: string[];
  updatedAt: string;
}

// Profile overlay result from scan analysis
export interface ProfileOverlay {
  personalWarnings: string[];
  adjustedRiskScore?: number;
  recommendedActions: string[];
}

// Mapping from quiz data to profile
export interface QuizToProfileMapping {
  skinTypeMap: Record<string, SkinType>;
  concernToFlagMap: Record<string, SkinFlag>;
  allergyToFlagMap: Record<string, SkinFlag>;
}
