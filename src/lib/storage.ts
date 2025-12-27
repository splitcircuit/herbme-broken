// Standardized localStorage key management
// All keys use 'herbme.' prefix for namespacing

export const STORAGE_KEYS = {
  CART: 'herbme.cart',
  SKIN_PROFILE: 'herbme.skinProfile',
  SCAN_HISTORY: 'herbme.scanHistory',
  WISHLIST: 'herbme.wishlist',
  RECENTLY_VIEWED: 'herbme.recentlyViewed',
  USER_LOCATION: 'herbme.userLocation',
} as const;

// Legacy keys that need migration
const LEGACY_KEY_MAP: Record<string, string> = {
  'herbme-wishlist': STORAGE_KEYS.WISHLIST,
  'herbme-recently-viewed': STORAGE_KEYS.RECENTLY_VIEWED,
  'scanHistory': STORAGE_KEYS.SCAN_HISTORY,
};

// Migrate old keys to new format (run once on app load)
export function migrateStorageKeys(): void {
  Object.entries(LEGACY_KEY_MAP).forEach(([oldKey, newKey]) => {
    const oldValue = localStorage.getItem(oldKey);
    if (oldValue && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, oldValue);
      localStorage.removeItem(oldKey);
    }
  });
}

// Type-safe storage helpers
export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function removeStorageItem(key: string): void {
  localStorage.removeItem(key);
}
