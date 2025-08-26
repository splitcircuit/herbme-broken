import { Product } from '@/types/product';
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

export const products: Product[] = [
  {
    id: "watermelon-bombshell",
    name: "Watermelon Bombshell",
    price: 28,
    image: product1,
    images: [product1, product2, product3],
    tag: "Sunkissed Collection",
    description: "Luxuriously lightweight yet deeply hydrating body oil infused with watermelon seed oil and tropical botanicals.",
    shortDescription: "Luxuriously lightweight yet deeply hydrating body oil",
    skinTypes: ['dry', 'normal', 'combination'],
    skinConcerns: ['dryness', 'dullness'],
    ingredients: [
      {
        name: "Watermelon Seed Oil",
        percentage: 25,
        benefits: ["Deep hydration", "Anti-aging", "Lightweight absorption"],
        description: "Rich in vitamins A and C, provides lightweight moisture",
        type: "oil"
      },
      {
        name: "Jojoba Oil",
        percentage: 20,
        benefits: ["Balances oil production", "Non-comedogenic", "Long-lasting moisture"],
        description: "Mimics skin's natural sebum for perfect balance",
        type: "oil"
      },
      {
        name: "Vitamin E",
        percentage: 5,
        benefits: ["Antioxidant protection", "Skin healing", "Anti-aging"],
        description: "Powerful antioxidant that protects and repairs",
        type: "active"
      },
      {
        name: "Sweet Orange Essential Oil",
        percentage: 2,
        benefits: ["Uplifting scent", "Vitamin C boost", "Natural glow"],
        description: "Energizing citrus scent with skin-brightening properties",
        type: "essential-oil"
      }
    ],
    benefits: [
      "24-hour hydration without greasiness",
      "Improves skin elasticity and firmness", 
      "Natural sun-kissed glow",
      "Fast-absorbing formula",
      "Suitable for daily use"
    ],
    howToUse: "Apply to clean, damp skin after shower. Massage in circular motions until absorbed. Use daily for best results.",
    category: 'body-oil',
    inStock: true,
    featured: true,
    newProduct: false,
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: "body-juice",
    name: "Body Juice",
    price: 26,
    image: product2,
    images: [product2, product1, product3],
    tag: "Sunkissed Collection",
    description: "Hydrating body essence with tropical fruit extracts for glowing, moisturized skin that feels refreshed all day.",
    shortDescription: "Hydrating body essence for glowing, moisturized skin",
    skinTypes: ['oily', 'combination', 'normal'],
    skinConcerns: ['dullness', 'dryness', 'oiliness'],
    ingredients: [
      {
        name: "Passion Fruit Extract",
        percentage: 15,
        benefits: ["Brightening", "Vitamin boost", "Natural glow"],
        description: "Rich in vitamin C for radiant skin",
        type: "extract"
      },
      {
        name: "Coconut Water",
        percentage: 30,
        benefits: ["Hydration", "Mineral replenishment", "Cooling effect"],
        description: "Natural electrolytes for skin hydration",
        type: "base"
      },
      {
        name: "Aloe Vera Gel",
        percentage: 20,
        benefits: ["Soothing", "Healing", "Anti-inflammatory"],
        description: "Calms and heals sensitive or irritated skin",
        type: "extract"
      },
      {
        name: "Hyaluronic Acid",
        percentage: 3,
        benefits: ["Intense hydration", "Plumping effect", "Moisture retention"],
        description: "Holds 1000x its weight in water for ultimate hydration",
        type: "active"
      }
    ],
    benefits: [
      "Lightweight, non-greasy formula",
      "Instant skin refreshment",
      "Long-lasting hydration",
      "Perfect for humid climates",
      "Quick absorption"
    ],
    howToUse: "Spray onto skin after cleansing. Gently pat in or let air dry. Can be used throughout the day for refreshing hydration.",
    category: 'body-mist',
    inStock: true,
    featured: false,
    newProduct: true,
    rating: 4.6,
    reviewCount: 89
  },
  {
    id: "foaming-body-scrub",
    name: "Foaming Body Scrub", 
    price: 32,
    image: product3,
    images: [product3, product1, product2],
    tag: "Sunkissed Collection",
    description: "5-in-one shower essential that foams, exfoliates, cleanses, hydrates, and softens for silky smooth skin.",
    shortDescription: "5-in-one shower essential that foams, exfoliates, cleanses, hydrates, and softens",
    skinTypes: ['dry', 'normal', 'combination', 'oily'],
    skinConcerns: ['dryness', 'dullness', 'rough texture'],
    ingredients: [
      {
        name: "Sugar Crystals",
        percentage: 25,
        benefits: ["Gentle exfoliation", "Natural humectant", "Smooth texture"],
        description: "Natural sugar gently removes dead skin cells",
        type: "active"
      },
      {
        name: "Coconut Oil",
        percentage: 20,
        benefits: ["Deep moisturizing", "Antimicrobial", "Skin barrier repair"],
        description: "Nourishes and protects skin while cleansing",
        type: "oil"
      },
      {
        name: "Shea Butter",
        percentage: 15,
        benefits: ["Rich moisturizing", "Anti-inflammatory", "Skin healing"],
        description: "Intensive moisture for very dry skin",
        type: "oil"
      },
      {
        name: "Natural Foaming Agents",
        percentage: 10,
        benefits: ["Gentle cleansing", "Rich lather", "Non-stripping"],
        description: "Plant-based cleansers that don't dry out skin",
        type: "base"
      }
    ],
    benefits: [
      "Removes dead skin cells gently",
      "Cleanses without stripping natural oils",
      "Leaves skin incredibly soft",
      "Rich, luxurious lather",
      "Suitable for sensitive skin"
    ],
    howToUse: "Apply to wet skin in shower. Massage in circular motions, focusing on rough areas. The formula will foam as you massage. Rinse thoroughly.",
    category: 'body-scrub',
    inStock: true,
    featured: true,
    newProduct: false,
    rating: 4.9,
    reviewCount: 203
  },
  {
    id: "body-mist",
    name: "Body Mist",
    price: 24,
    image: product1,
    images: [product1, product3, product2],
    tag: "Sunkissed Collection", 
    description: "Juicy, sweet, and refreshing scent with tropical notes for long-lasting summer fragrance that energizes your day.",
    shortDescription: "Juicy, sweet, and refreshing scent for long-lasting summer fragrance",
    skinTypes: ['normal', 'dry', 'oily', 'combination', 'sensitive'],
    skinConcerns: ['dryness'],
    ingredients: [
      {
        name: "Tropical Fruit Blend",
        percentage: 8,
        benefits: ["Uplifting scent", "Long-lasting fragrance", "Mood boosting"],
        description: "Blend of mango, pineapple, and coconut essences",
        type: "essential-oil"
      },
      {
        name: "Rose Water",
        percentage: 40,
        benefits: ["Hydrating", "Soothing", "pH balancing"],
        description: "Pure rose water for gentle hydration",
        type: "base"
      },
      {
        name: "Glycerin",
        percentage: 10,
        benefits: ["Moisture retention", "Smooth application", "Skin softening"],
        description: "Plant-derived humectant for lasting moisture",
        type: "active"
      },
      {
        name: "Witch Hazel",
        percentage: 5,
        benefits: ["Toning", "Pore minimizing", "Gentle astringent"],
        description: "Natural toner that refreshes and tightens skin",
        type: "extract"
      }
    ],
    benefits: [
      "All-day tropical fragrance",
      "Lightweight, non-sticky formula", 
      "Mood-boosting aromatherapy",
      "Gentle on sensitive skin",
      "Perfect for layering with other products"
    ],
    howToUse: "Spray 6-8 inches from body on pulse points or all over. Reapply throughout the day as desired. Can be layered over body oil for longer-lasting scent.",
    category: 'body-mist',
    inStock: true,
    featured: false,
    newProduct: false,
    rating: 4.5,
    reviewCount: 67
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getNewProducts = (): Product[] => {
  return products.filter(product => product.newProduct);
};