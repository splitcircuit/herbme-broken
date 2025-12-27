import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '@/lib/storage';

interface RecentlyViewedContextType {
  recentlyViewed: string[];
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

interface RecentlyViewedProviderProps {
  children: ReactNode;
}

export const RecentlyViewedProvider = ({ children }: RecentlyViewedProviderProps) => {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const maxItems = 6;

  useEffect(() => {
    const saved = getStorageItem<string[]>(STORAGE_KEYS.RECENTLY_VIEWED);
    if (saved) setRecentlyViewed(saved);
  }, []);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, recentlyViewed);
  }, [recentlyViewed]);

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, maxItems);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  const value: RecentlyViewedContextType = {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};