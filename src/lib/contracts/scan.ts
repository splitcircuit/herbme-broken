// Scan-related TypeScript contracts
// Matches scan_events.result_json structure

export interface ScanFlag {
  key: string;
  label: string;
  severity: 1 | 2 | 3;
  matched: string[];
}

export interface MatchedIngredient {
  name: string;
  slug: string;
  categories: string[];
  severity: 1 | 2 | 3;
  notes: string;
  matchedTerm: string;
}

export interface ScanResult {
  riskScore: number;
  riskTier: 'low' | 'moderate' | 'high';
  flags: ScanFlag[];
  summary: string[];
  matchedIngredients: MatchedIngredient[];
  disclaimer: string;
}

export interface ScanEvent {
  id: string;
  userId?: string | null;
  inputType: 'paste' | 'product' | 'barcode';
  productId?: string | null;
  barcode?: string | null;
  rawIngredientsText?: string | null;
  resultJson: ScanResult;
  createdAt: string;
}

export interface ScanHistoryItem {
  scanId: string;
  createdAt: string;
}

// Input types for the scanner
export type ScanInputType = 'paste' | 'product' | 'barcode';
