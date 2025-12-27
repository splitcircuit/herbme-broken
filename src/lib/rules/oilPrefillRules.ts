// Oil Prefill Rules
// Generates OilFormulaDraft from scan results + optional profile

import type { ScanResult } from '../contracts/scan';
import type { SkinProfile } from '../contracts/profile';
import type { OilFormulaDraft, SupportGoal, BaseOilSelection } from '../contracts/oil';

// Base oil recommendations per goal
const GOAL_BASE_OILS: Record<SupportGoal, BaseOilSelection[]> = {
  calm: [
    { name: 'Jojoba Oil', percentage: 50 },
    { name: 'Sunflower Oil', percentage: 30 },
    { name: 'Avocado Oil', percentage: 20 },
  ],
  barrier: [
    { name: 'Jojoba Oil', percentage: 40 },
    { name: 'Avocado Oil', percentage: 35 },
    { name: 'Sunflower Oil', percentage: 25 },
  ],
  acne: [
    { name: 'Jojoba Oil', percentage: 50 },
    { name: 'Grapeseed Oil', percentage: 35 },
    { name: 'Sunflower Oil', percentage: 15 },
  ],
  brighten: [
    { name: 'Jojoba Oil', percentage: 40 },
    { name: 'Grapeseed Oil', percentage: 30 },
    { name: 'Avocado Oil', percentage: 30 },
  ],
};

// Boost ingredients per goal
const GOAL_BOOSTS: Record<SupportGoal, string[]> = {
  calm: ['Vitamin E'],
  barrier: ['Vitamin E', 'Argan Oil'],
  acne: ['Hemp Seed Oil', 'Vitamin E'],
  brighten: ['Rosehip Oil', 'Vitamin E'],
};

// Scent recommendations per goal (safe options)
const GOAL_SCENTS: Record<SupportGoal, string> = {
  calm: 'Lavender',
  barrier: 'Unscented',
  acne: 'Unscented',
  brighten: 'Citrus Blend',
};

// Rationale templates
const GOAL_RATIONALE: Record<SupportGoal, string[]> = {
  calm: [
    'Jojoba Oil closely mimics skin\'s natural sebum for gentle, non-irritating hydration',
    'Sunflower Oil provides anti-inflammatory benefits with vitamin E',
    'Avocado Oil deeply nourishes without clogging pores',
  ],
  barrier: [
    'This blend focuses on restoring and strengthening your skin barrier',
    'Avocado Oil is rich in fatty acids that support barrier repair',
    'Added Argan Oil provides extra ceramide-like support',
  ],
  acne: [
    'Non-comedogenic oils selected to avoid pore congestion',
    'Grapeseed Oil is lightweight and won\'t trigger breakouts',
    'Hemp Seed Oil helps balance sebum production naturally',
  ],
  brighten: [
    'Rosehip Oil is rich in vitamin A for natural brightening',
    'Grapeseed Oil provides antioxidants for even skin tone',
    'This blend supports cell turnover and radiance',
  ],
};

interface PrefillOptions {
  scanResult: ScanResult;
  profile?: SkinProfile;
  goal?: SupportGoal;
}

export function generateOilPrefill(options: PrefillOptions): OilFormulaDraft {
  const { scanResult, profile, goal: providedGoal } = options;
  
  // Determine goal from scan if not provided
  const goal = providedGoal || determineGoalFromScan(scanResult);
  
  // Check if profile or scan indicates fragrance sensitivity
  const isFragranceSensitive = 
    profile?.flags.includes('fragrance_sensitive') ||
    scanResult.flags.some(f => f.key === 'fragrance' || f.key === 'essential_oil');

  // Build the draft
  const baseOils = [...GOAL_BASE_OILS[goal]];
  let boostIngredients = [...GOAL_BOOSTS[goal]];
  let scent = isFragranceSensitive ? 'Unscented' : GOAL_SCENTS[goal];
  const rationale = [...GOAL_RATIONALE[goal]];

  // Filter out allergens if profile has allergies
  if (profile?.allergies?.length) {
    const allergyLower = profile.allergies.map(a => a.toLowerCase());
    
    // Remove base oils that match allergies
    const filteredBaseOils = baseOils.filter(oil => {
      const oilLower = oil.name.toLowerCase();
      return !allergyLower.some(a => oilLower.includes(a));
    });
    
    // Ensure we have at least one base oil
    if (filteredBaseOils.length > 0) {
      // Redistribute percentages
      const totalPercent = filteredBaseOils.reduce((sum, o) => sum + o.percentage, 0);
      filteredBaseOils.forEach(oil => {
        oil.percentage = Math.round((oil.percentage / totalPercent) * 100);
      });
      baseOils.length = 0;
      baseOils.push(...filteredBaseOils);
    }

    // Filter boosts
    boostIngredients = boostIngredients.filter(boost => {
      const boostLower = boost.toLowerCase();
      return !allergyLower.some(a => boostLower.includes(a));
    });
  }

  // Add scan-based rationale
  if (scanResult.flags.length > 0) {
    const flagLabels = scanResult.flags.slice(0, 2).map(f => f.label);
    rationale.unshift(`Based on detected ${flagLabels.join(' and ')} in your scanned product`);
  }

  if (isFragranceSensitive) {
    rationale.push('Keeping unscented to avoid fragrance irritation');
  }

  return {
    baseOils,
    boostIngredients,
    scent,
    goal,
    rationale,
  };
}

// Determine best goal from scan result
function determineGoalFromScan(scanResult: ScanResult): SupportGoal {
  const flagKeys = scanResult.flags.map(f => f.key);
  
  if (flagKeys.some(k => ['irritant', 'sensitizer', 'fragrance', 'essential_oil'].includes(k))) {
    return 'calm';
  }
  if (flagKeys.some(k => ['acne_trigger', 'comedogenic'].includes(k))) {
    return 'acne';
  }
  if (flagKeys.some(k => ['barrier_disruptor', 'drying_alcohol'].includes(k))) {
    return 'barrier';
  }
  if (flagKeys.some(k => ['photosensitivity', 'glycation'].includes(k))) {
    return 'brighten';
  }
  
  // Default to calm as safest option
  return 'calm';
}

// Get human-readable goal label
export function getGoalLabel(goal: SupportGoal): string {
  const labels: Record<SupportGoal, string> = {
    calm: 'Calm & Soothe',
    barrier: 'Barrier Repair',
    acne: 'Acne Support',
    brighten: 'Brighten & Even',
  };
  return labels[goal];
}

// Get goal description
export function getGoalDescription(goal: SupportGoal): string {
  const descriptions: Record<SupportGoal, string> = {
    calm: 'A gentle blend to soothe irritated or sensitive skin',
    barrier: 'Nourishing oils to strengthen and repair your skin barrier',
    acne: 'Lightweight, non-comedogenic oils to support acne-prone skin',
    brighten: 'Antioxidant-rich oils to even skin tone and boost radiance',
  };
  return descriptions[goal];
}
