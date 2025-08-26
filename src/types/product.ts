export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  tag: string;
  description: string;
  shortDescription: string;
  skinTypes: ('dry' | 'oily' | 'combination' | 'sensitive' | 'normal')[];
  skinConcerns: ('acne' | 'aging' | 'dryness' | 'oiliness' | 'sensitivity' | 'dullness' | 'pigmentation' | 'pores' | 'rough texture')[];
  ingredients: Ingredient[];
  benefits: string[];
  howToUse: string;
  category: 'body-oil' | 'body-scrub' | 'body-mist' | 'cleanser' | 'moisturizer';
  inStock: boolean;
  featured: boolean;
  newProduct: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface Ingredient {
  name: string;
  percentage?: number;
  benefits: string[];
  description: string;
  type: 'oil' | 'extract' | 'essential-oil' | 'active' | 'base';
}

export interface ProductFilter {
  skinTypes: string[];
  skinConcerns: string[];
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
  search: string;
}