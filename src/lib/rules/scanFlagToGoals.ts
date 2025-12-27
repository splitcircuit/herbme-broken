// Scan Flag to Support Goals Mapping
// Maps detected scan flags to recommended support goals for oil builder

import type { ScanResult, ScanFlag } from '../contracts/scan';
import type { SupportGoal } from '../contracts/oil';
import type { SkinProfile } from '../contracts/profile';

// Map scan flag keys to support goals (priority order)
const FLAG_TO_GOAL_MAP: Record<string, SupportGoal[]> = {
  // Irritation-related flags → calm
  'irritant': ['calm', 'barrier'],
  'sensitizer': ['calm', 'barrier'],
  'essential_oil': ['calm'],
  'fragrance': ['calm'],
  
  // Barrier-related flags → barrier
  'barrier_disruptor': ['barrier', 'calm'],
  'drying_alcohol': ['barrier'],
  
  // Acne-related flags → acne
  'acne_trigger': ['acne'],
  'comedogenic': ['acne'],
  'inflammation': ['acne', 'calm'],
  
  // Brightening/aging flags → brighten
  'photosensitivity': ['brighten'],
  'glycation': ['brighten'],
};

// Profile flags that influence goal recommendation
const PROFILE_FLAG_BOOST: Record<string, SupportGoal> = {
  'fragrance_sensitive': 'calm',
  'eczema_prone': 'barrier',
  'acne_prone': 'acne',
  'hyperpigmentation_concern': 'brighten',
  'rosacea_prone': 'calm',
  'dehydration_prone': 'barrier',
};

export interface GoalRecommendation {
  goal: SupportGoal;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

// Get recommended support goal based on scan results
export function getRecommendedGoal(
  scanResult: ScanResult,
  profile?: SkinProfile
): GoalRecommendation | null {
  const goalScores: Record<SupportGoal, number> = {
    calm: 0,
    barrier: 0,
    acne: 0,
    brighten: 0,
  };
  
  const goalReasons: Record<SupportGoal, string[]> = {
    calm: [],
    barrier: [],
    acne: [],
    brighten: [],
  };

  // Score based on scan flags
  scanResult.flags.forEach((flag: ScanFlag) => {
    const goals = FLAG_TO_GOAL_MAP[flag.key];
    if (goals) {
      goals.forEach((goal, index) => {
        // Primary goal gets more weight
        const weight = index === 0 ? flag.severity * 2 : flag.severity;
        goalScores[goal] += weight;
        if (!goalReasons[goal].includes(flag.label)) {
          goalReasons[goal].push(flag.label);
        }
      });
    }
  });

  // Boost based on profile flags
  if (profile) {
    profile.flags.forEach((flag) => {
      const goal = PROFILE_FLAG_BOOST[flag];
      if (goal) {
        goalScores[goal] += 3; // Profile match is a strong signal
      }
    });
  }

  // Find highest scoring goal
  let topGoal: SupportGoal | null = null;
  let topScore = 0;
  
  (Object.entries(goalScores) as [SupportGoal, number][]).forEach(([goal, score]) => {
    if (score > topScore) {
      topScore = score;
      topGoal = goal;
    }
  });

  if (!topGoal || topScore === 0) {
    return null;
  }

  // Determine confidence level
  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (topScore >= 8) {
    confidence = 'high';
  } else if (topScore >= 4) {
    confidence = 'medium';
  }

  // Build reason string
  const reasons = goalReasons[topGoal];
  let reason = '';
  
  switch (topGoal) {
    case 'calm':
      reason = `Detected ${reasons.slice(0, 2).join(' and ')} that may irritate skin`;
      break;
    case 'barrier':
      reason = `Found ${reasons.slice(0, 2).join(' and ')} that may compromise skin barrier`;
      break;
    case 'acne':
      reason = `Contains ${reasons.slice(0, 2).join(' and ')} that may trigger breakouts`;
      break;
    case 'brighten':
      reason = `Includes ${reasons.slice(0, 2).join(' and ')} that may affect skin tone`;
      break;
  }

  return {
    goal: topGoal,
    confidence,
    reason,
  };
}

// Get all applicable goals sorted by relevance
export function getAllApplicableGoals(
  scanResult: ScanResult,
  profile?: SkinProfile
): SupportGoal[] {
  const goalScores: Record<SupportGoal, number> = {
    calm: 0,
    barrier: 0,
    acne: 0,
    brighten: 0,
  };

  scanResult.flags.forEach((flag: ScanFlag) => {
    const goals = FLAG_TO_GOAL_MAP[flag.key];
    if (goals) {
      goals.forEach((goal, index) => {
        goalScores[goal] += index === 0 ? flag.severity * 2 : flag.severity;
      });
    }
  });

  if (profile) {
    profile.flags.forEach((flag) => {
      const goal = PROFILE_FLAG_BOOST[flag];
      if (goal) goalScores[goal] += 3;
    });
  }

  return (Object.entries(goalScores) as [SupportGoal, number][])
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([goal]) => goal);
}
