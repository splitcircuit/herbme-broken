// Profile Normalizer
// Converts quiz data to canonical SkinProfile format

import type { SkinProfile, SkinType, SkinFlag } from '../contracts/profile';

// Map quiz skin type selections to canonical SkinType
const SKIN_TYPE_MAP: Record<string, SkinType> = {
  'Oily': 'oily',
  'Dry': 'dry',
  'Combination': 'combination',
  'Normal': 'normal',
  'Sensitive': 'sensitive',
  'Not sure': 'normal', // Default fallback
};

// Map quiz concerns to SkinFlags
const CONCERN_TO_FLAG_MAP: Record<string, SkinFlag> = {
  'Reduce acne or breakouts': 'acne_prone',
  'Fade dark spots or hyperpigmentation': 'hyperpigmentation_concern',
  'Soothe sensitive or irritated skin': 'fragrance_sensitive',
  'Anti-aging / firming': 'aging_concern',
  'Hydrate dry skin': 'dehydration_prone',
  'Redness or rosacea': 'rosacea_prone',
};

// Map quiz allergies to SkinFlags
const ALLERGY_TO_FLAG_MAP: Record<string, SkinFlag> = {
  'Fragrance': 'fragrance_sensitive',
  'Essential oils (e.g. lavender, peppermint, tea tree)': 'fragrance_sensitive',
  'Nuts (e.g. almond oil, shea butter)': 'allergy_prone',
  'Aloe vera': 'allergy_prone',
  'Coconut': 'allergy_prone',
};

interface QuizData {
  skin_type?: string[];
  skincare_goals?: string[];
  skin_concerns?: string[];
  allergies?: string[];
  sun_exposure?: string;
}

// Normalize quiz data into canonical SkinProfile
export function normalizeQuizToProfile(quizData: QuizData): SkinProfile {
  const flags: SkinFlag[] = [];
  const allergies: string[] = [];

  // Determine primary skin type
  let skinType: SkinType = 'normal';
  if (quizData.skin_type && quizData.skin_type.length > 0) {
    // If sensitive is selected, use it; otherwise use first selection
    if (quizData.skin_type.includes('Sensitive')) {
      skinType = 'sensitive';
    } else {
      const firstType = quizData.skin_type[0];
      skinType = SKIN_TYPE_MAP[firstType] || 'normal';
    }
  }

  // Map skincare goals to flags
  quizData.skincare_goals?.forEach(goal => {
    const flag = CONCERN_TO_FLAG_MAP[goal];
    if (flag && !flags.includes(flag)) {
      flags.push(flag);
    }
  });

  // Map skin concerns to flags
  quizData.skin_concerns?.forEach(concern => {
    const flag = CONCERN_TO_FLAG_MAP[concern];
    if (flag && !flags.includes(flag)) {
      flags.push(flag);
    }
  });

  // Map allergies to flags and allergies list
  quizData.allergies?.forEach(allergy => {
    if (allergy !== "I don't have any allergies" && allergy !== "I'm not sure") {
      allergies.push(allergy);
      const flag = ALLERGY_TO_FLAG_MAP[allergy];
      if (flag && !flags.includes(flag)) {
        flags.push(flag);
      }
    }
  });

  // Sun exposure → sun_sensitive flag
  if (quizData.sun_exposure === 'Daily / I work outside' || 
      quizData.sun_exposure === "I don't use sunscreen") {
    if (!flags.includes('sun_sensitive')) {
      flags.push('sun_sensitive');
    }
  }

  // If skin type is sensitive, ensure fragrance_sensitive is included
  if (skinType === 'sensitive' && !flags.includes('fragrance_sensitive')) {
    flags.push('fragrance_sensitive');
  }

  return {
    skinType,
    flags,
    allergies: allergies.length > 0 ? allergies : undefined,
    updatedAt: new Date().toISOString(),
  };
}

// Validate and normalize a raw profile object
export function validateProfile(raw: unknown): SkinProfile | null {
  if (!raw || typeof raw !== 'object') return null;
  
  const obj = raw as Record<string, unknown>;
  
  const validSkinTypes: SkinType[] = ['oily', 'dry', 'combination', 'normal', 'sensitive'];
  const skinType = validSkinTypes.includes(obj.skinType as SkinType) 
    ? (obj.skinType as SkinType) 
    : 'normal';

  const flags = Array.isArray(obj.flags) ? obj.flags.filter((f): f is SkinFlag => 
    typeof f === 'string'
  ) : [];

  const allergies = Array.isArray(obj.allergies) ? obj.allergies.filter((a): a is string => 
    typeof a === 'string'
  ) : undefined;

  return {
    skinType,
    flags,
    allergies,
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : new Date().toISOString(),
  };
}
