// Product TypeScript contracts
// Distinct types for local shop products vs. database catalog products

// Local products from src/data/products.ts (used in Shop)
export interface ShopProductLocal {
  id: string;
  name: string;
  price: number;
  image: string;
  tag: string;
  shortDescription: string;
  description: string;
  skinTypes: string[];
  benefits: string[];
  ingredients: { name: string; benefit?: string }[];
  howToUse: string;
  rating?: number;
  reviewCount?: number;
}

// Database products from Supabase products table (used in Scanner, Quiz)
export interface CatalogProductDB {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  ingredients: string[] | null;
  skinTypes: string[] | null;
  skinGoals: string[] | null;
  inventoryQuantity: number;
  isActive: boolean | null;
  createdAt: string;
}

// Cart item type (supports both sources)
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  type: 'product' | 'custom_blend';
}

// Product search result for scanner
export interface ProductSearchResult {
  id: string;
  name: string;
  category: string;
  ingredientsText?: string;
}
