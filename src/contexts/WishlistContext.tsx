import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '@/lib/storage';

interface WishlistContextType {
  wishlistItems: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  useEffect(() => {
    const saved = getStorageItem<string[]>(STORAGE_KEYS.WISHLIST);
    if (saved) setWishlistItems(saved);
  }, []);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.WISHLIST, wishlistItems);
  }, [wishlistItems]);

  const addToWishlist = (productId: string) => {
    setWishlistItems(prev => 
      prev.includes(productId) ? prev : [...prev, productId]
    );
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(id => id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};