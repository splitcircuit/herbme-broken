// Profile Risk Overlay
// Adds personalized interpretation to scan results based on user's skin profile

import type { ScanResult, ScanFlag } from '../contracts/scan';
import type { SkinProfile, ProfileOverlay, SkinFlag as ProfileFlag } from '../contracts/profile';

// Map scan flag keys to profile flags that increase concern
const FLAG_SENSITIVITY_MAP: Record<string, ProfileFlag[]> = {
  'fragrance': ['fragrance_sensitive'],
  'allergen': ['allergy_prone', 'fragrance_sensitive'],
  'irritant': ['fragrance_sensitive', 'eczema_prone', 'rosacea_prone'],
  'acne_trigger': ['acne_prone'],
  'comedogenic': ['acne_prone'],
  'barrier_disruptor': ['eczema_prone', 'dehydration_prone'],
  'sensitizer': ['fragrance_sensitive', 'allergy_prone'],
  'photosensitivity': ['sun_sensitive', 'hyperpigmentation_concern'],
  'inflammation': ['rosacea_prone', 'acne_prone'],
  'essential_oil': ['fragrance_sensitive'],
};

// Personalized warning messages for each flag-profile combination
const WARNING_MESSAGES: Record<string, Record<string, string>> = {
  fragrance: {
    fragrance_sensitive: 'Contains fragrance which may irritate your sensitive skin. Consider fragrance-free alternatives.',
  },
  allergen: {
    allergy_prone: 'Contains potential allergens. Patch test recommended before use.',
    fragrance_sensitive: 'Contains allergens that may trigger a reaction.',
  },
  irritant: {
    fragrance_sensitive: 'Contains irritants that may not suit your sensitive skin.',
    eczema_prone: 'May aggravate eczema-prone skin. Use with caution.',
    rosacea_prone: 'May trigger rosacea flare-ups.',
  },
  acne_trigger: {
    acne_prone: 'Contains ingredients known to trigger breakouts for acne-prone skin.',
  },
  comedogenic: {
    acne_prone: 'Contains pore-clogging ingredients. May cause breakouts.',
  },
  barrier_disruptor: {
    eczema_prone: 'May weaken your skin barrier. Consider gentler options.',
    dehydration_prone: 'Could worsen skin dehydration.',
  },
  sensitizer: {
    fragrance_sensitive: 'Contains sensitizers that may increase skin sensitivity over time.',
    allergy_prone: 'May cause sensitization with repeated use.',
  },
  photosensitivity: {
    sun_sensitive: 'Increases sun sensitivity. Always use SPF with this product.',
    hyperpigmentation_concern: 'May worsen hyperpigmentation if used without sun protection.',
  },
  inflammation: {
    rosacea_prone: 'May cause inflammation and redness.',
    acne_prone: 'May promote inflammatory acne.',
  },
  essential_oil: {
    fragrance_sensitive: 'Contains essential oils which may irritate sensitive skin.',
  },
};

// Action recommendations based on profile
const ACTION_RECOMMENDATIONS: Record<ProfileFlag, string> = {
  fragrance_sensitive: 'Look for products labeled "fragrance-free" or "unscented".',
  acne_prone: 'Choose non-comedogenic formulas and patch test new products.',
  eczema_prone: 'Opt for minimal ingredient lists and ceramide-rich formulas.',
  hyperpigmentation_concern: 'Always pair active ingredients with SPF 30+.',
  allergy_prone: 'Perform a 24-hour patch test before trying new products.',
  rosacea_prone: 'Avoid extreme temperatures and physical exfoliants.',
  aging_concern: 'Introduce actives gradually to minimize irritation.',
  dehydration_prone: 'Layer hydrating products and avoid drying alcohols.',
  sun_sensitive: 'Apply broad-spectrum SPF daily, even on cloudy days.',
};

export function getProfileOverlay(
  scanResult: ScanResult,
  profile: SkinProfile
): ProfileOverlay {
  const personalWarnings: string[] = [];
  const triggeredFlags = new Set<ProfileFlag>();

  // Check each scan flag against profile sensitivities
  scanResult.flags.forEach((flag: ScanFlag) => {
    const sensitiveProfiles = FLAG_SENSITIVITY_MAP[flag.key] || [];
    
    sensitiveProfiles.forEach((profileFlag) => {
      if (profile.flags.includes(profileFlag)) {
        triggeredFlags.add(profileFlag);
        
        // Get personalized warning message
        const warningMap = WARNING_MESSAGES[flag.key];
        if (warningMap && warningMap[profileFlag]) {
          const warning = warningMap[profileFlag];
          if (!personalWarnings.includes(warning)) {
            personalWarnings.push(warning);
          }
        }
      }
    });
  });

  // Calculate adjusted risk score (increase if profile matches triggers)
  let adjustedRiskScore: number | undefined;
  if (triggeredFlags.size > 0) {
    const boost = Math.min(triggeredFlags.size * 5, 20); // Max +20 points
    adjustedRiskScore = Math.min(scanResult.riskScore + boost, 100);
  }

  // Build recommended actions based on triggered flags
  const recommendedActions: string[] = [];
  triggeredFlags.forEach((flag) => {
    const action = ACTION_RECOMMENDATIONS[flag];
    if (action && !recommendedActions.includes(action)) {
      recommendedActions.push(action);
    }
  });

  // If no specific warnings but profile exists, add general advice
  if (personalWarnings.length === 0 && scanResult.riskScore > 30) {
    if (profile.flags.includes('fragrance_sensitive')) {
      recommendedActions.push('Your profile indicates fragrance sensitivity—review the ingredient list carefully.');
    }
  }

  return {
    personalWarnings,
    adjustedRiskScore,
    recommendedActions,
  };
}

// Check if profile has any sensitivities that match scan flags
export function hasRelevantSensitivities(
  scanResult: ScanResult,
  profile: SkinProfile
): boolean {
  return scanResult.flags.some((flag) => {
    const sensitiveProfiles = FLAG_SENSITIVITY_MAP[flag.key] || [];
    return sensitiveProfiles.some((pf) => profile.flags.includes(pf));
  });
}
