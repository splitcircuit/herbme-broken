import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  const maxItems = 6; // Maximum number of recently viewed items

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('herbme-recently-viewed');
    if (saved) {
      setRecentlyViewed(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('herbme-recently-viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(id => id !== productId);
      // Add to front and limit to maxItems
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