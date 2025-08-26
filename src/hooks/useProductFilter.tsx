import { useState, useMemo } from 'react';
import { Product, ProductFilter } from '@/types/product';

const initialFilter: ProductFilter = {
  skinTypes: [],
  skinConcerns: [],
  categories: [],
  priceRange: [0, 100],
  inStock: false,
  search: ''
};

export const useProductFilter = (products: Product[]) => {
  const [filter, setFilter] = useState<ProductFilter>(initialFilter);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm)) ||
          product.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Skin type filter
      if (filter.skinTypes.length > 0) {
        const matchesSkinType = filter.skinTypes.some(type => 
          product.skinTypes.includes(type as any)
        );
        if (!matchesSkinType) return false;
      }

      // Skin concerns filter
      if (filter.skinConcerns.length > 0) {
        const matchesConcerns = filter.skinConcerns.some(concern => 
          product.skinConcerns.includes(concern as any)
        );
        if (!matchesConcerns) return false;
      }

      // Category filter
      if (filter.categories.length > 0) {
        if (!filter.categories.includes(product.category)) return false;
      }

      // Price range filter
      if (product.price < filter.priceRange[0] || product.price > filter.priceRange[1]) {
        return false;
      }

      // In stock filter
      if (filter.inStock && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [products, filter]);

  const updateFilter = (newFilter: Partial<ProductFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const resetFilter = () => {
    setFilter(initialFilter);
  };

  const hasActiveFilters = useMemo(() => {
    return filter.skinTypes.length > 0 ||
           filter.skinConcerns.length > 0 ||
           filter.categories.length > 0 ||
           filter.search !== '' ||
           filter.inStock ||
           filter.priceRange[0] !== 0 ||
           filter.priceRange[1] !== 100;
  }, [filter]);

  return {
    filter,
    filteredProducts,
    updateFilter,
    resetFilter,
    hasActiveFilters,
    productCount: filteredProducts.length,
    totalProducts: products.length
  };
};