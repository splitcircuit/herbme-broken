import { useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandler';
import type { Product } from '@/types/product';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  type: 'product' | 'custom_blend';
}

/**
 * Centralized hook for managing common actions across the application
 */
export const useActions = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { toast } = useToast();

  const handleAddToCart = useCallback(async (item: Omit<CartItem, 'quantity'>) => {
    try {
      addToCart(item);
      toast({
        title: "Added to Cart!",
        description: `${item.name} has been added to your cart.`,
      });
    } catch (error) {
      handleError(error, 'Add to Cart');
    }
  }, [addToCart, toast]);

  const handleToggleWishlist = useCallback(async (product: Product) => {
    try {
      const isCurrentlyInWishlist = isInWishlist(product.id);
      
      if (isCurrentlyInWishlist) {
        removeFromWishlist(product.id);
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        });
      } else {
        addToWishlist(product.id);
        toast({
          title: "Added to Wishlist!",
          description: `${product.name} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      handleError(error, 'Toggle Wishlist');
    }
  }, [addToWishlist, removeFromWishlist, isInWishlist, toast]);

  const handleMarkAsViewed = useCallback(async (product: Product) => {
    try {
      addToRecentlyViewed(product.id);
    } catch (error) {
      handleError(error, 'Mark as Viewed');
    }
  }, [addToRecentlyViewed]);

  return {
    handleAddToCart,
    handleToggleWishlist,
    handleMarkAsViewed,
  };
};