import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Leaf, Droplets, Sun } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

// Shopify Buy Button type declarations
declare global {
  interface Window {
    ShopifyBuy?: {
      buildClient: (config: { domain: string; storefrontAccessToken: string }) => any;
      UI: {
        onReady: (client: any) => Promise<any>;
      };
    };
  }
}

const Product = () => {
  const { id } = useParams();

  useEffect(() => {
    // Load Shopify Buy Button script
    const loadShopifyScript = () => {
      if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
          initializeShopifyBuyButton();
        } else {
          loadScript();
        }
      } else {
        loadScript();
      }
    };

    const loadScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
      script.onload = initializeShopifyBuyButton;
    };

    const initializeShopifyBuyButton = () => {
      const client = window.ShopifyBuy.buildClient({
        domain: '089d19-46.myshopify.com',
        storefrontAccessToken: '104acab7f6116806004f40bfea218a3b',
      });

      window.ShopifyBuy.UI.onReady(client).then((ui) => {
        ui.createComponent('product', {
          id: '9968064069923',
          node: document.getElementById('shopify-product-component'),
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: {
            product: {
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "100%",
                    "margin-left": "0px",
                    "margin-bottom": "0px"
                  }
                },
                button: {
                  "background-color": "#2B5A3E",
                  ":hover": {
                    "background-color": "#234A32"
                  },
                  "border-radius": "8px",
                  "padding": "12px 24px"
                }
              },
              buttonDestination: "checkout",
              text: {
                button: "Buy Now"
              }
            },
            productSet: {
              styles: {
                products: {
                  "@media (min-width: 601px)": {
                    "margin-left": "0px"
                  }
                }
              }
            },
            modalProduct: {
              contents: {
                img: false,
                imgWithCarousel: true,
                button: false,
                buttonWithQuantity: true
              },
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "100%",
                    "margin-left": "0px",
                    "margin-bottom": "0px"
                  }
                }
              },
              text: {
                button: "Add to cart"
              }
            },
            option: {},
            cart: {
              text: {
                total: "Subtotal",
                button: "Checkout"
              }
            },
            toggle: {}
          },
        });
      });
    };

    loadShopifyScript();

    // Cleanup function
    return () => {
      const existingComponent = document.getElementById('shopify-product-component');
      if (existingComponent) {
        existingComponent.innerHTML = '';
      }
    };
  }, [id]);
  
  // Mock product data - in a real app, this would come from an API
  const productData: { [key: string]: any } = {
    "1": {
      name: "Sea Moss Recovery Cream",
      price: "$45",
      image: product1,
      tag: "Best Seller",
      shortDescription: "Ultra-hydrating cream with pure sea moss extract",
      longDescription: "Our signature Sea Moss Recovery Cream harnesses the incredible power of freshly harvested sea moss from the pristine waters surrounding the Turks & Caicos Islands. This luxurious cream provides deep hydration while supporting your skin's natural healing process.",
      ingredients: ["Organic Sea Moss Extract", "Shea Butter", "Coconut Oil", "Vitamin E", "Aloe Vera", "Jojoba Oil"],
      howToUse: "Apply a small amount to clean, dry skin. Gently massage in circular motions until fully absorbed. Use morning and evening for best results.",
      skinTypes: ["Dry Skin", "Sensitive Skin", "Mature Skin", "All Skin Types"],
      benefits: ["Deep Hydration", "Anti-Aging", "Healing Properties", "Natural Glow"]
    },
    "2": {
      name: "Turmeric Brightening Serum",
      price: "$38",
      image: product2,
      tag: "New",
      shortDescription: "Brightening serum with golden turmeric and botanicals",
      longDescription: "Discover the brightening power of our Turmeric Brightening Serum, formulated with golden turmeric root and complementary botanicals. This lightweight serum helps even skin tone while providing antioxidant protection.",
      ingredients: ["Turmeric Root Extract", "Vitamin C", "Hyaluronic Acid", "Niacinamide", "Rose Hip Oil", "Green Tea Extract"],
      howToUse: "Apply 2-3 drops to clean skin before moisturizer. Use in the evening and always follow with SPF during the day.",
      skinTypes: ["Dull Skin", "Uneven Tone", "Acne-Prone", "Normal Skin"],
      benefits: ["Brightening", "Even Tone", "Antioxidant Protection", "Radiant Complexion"]
    },
    "3": {
      name: "Aloe Gentle Cleanser",
      price: "$28",
      image: product3,
      tag: "Sensitive Skin",
      shortDescription: "Gentle daily cleanser with soothing aloe vera",
      longDescription: "Start your skincare routine with our Aloe Gentle Cleanser, specially formulated for sensitive skin. This creamy cleanser removes impurities while maintaining your skin's natural moisture barrier.",
      ingredients: ["Aloe Vera Gel", "Chamomile Extract", "Cucumber Extract", "Coconut-Derived Cleansers", "Glycerin", "Calendula Oil"],
      howToUse: "Massage onto damp skin with gentle circular motions. Rinse thoroughly with lukewarm water. Use morning and evening.",
      skinTypes: ["Sensitive Skin", "Dry Skin", "Reactive Skin", "All Skin Types"],
      benefits: ["Gentle Cleansing", "Soothing", "Hydrating", "Non-Irritating"]
    }
  };

  const product = productData[id || "1"];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-brand-brown mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-smooth">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-primary transition-smooth">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-auto rounded-2xl shadow-card"
              />
              <Badge className="absolute top-6 left-6 bg-success text-success-foreground">
                {product.tag}
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-brown mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {product.shortDescription}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-brand-green">{product.price}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(127 reviews)</span>
                </div>
              </div>
            </div>

            {/* Skin Type Badges */}
            <div>
              <h3 className="font-heading font-semibold mb-3">Perfect For:</h3>
              <div className="flex flex-wrap gap-2">
                {product.skinTypes.map((type: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-herb-light-green text-herb-deep-green">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-heading font-semibold mb-3">Key Benefits:</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-herb-deep-green" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopify Buy Button Area */}
            <Card className="border-0 bg-herb-soft-sage/30">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Purchase Options</h3>
                <div className="space-y-4">
                  <div id="shopify-product-component" className="min-h-[120px]"></div>
                  <div className="text-xs text-muted-foreground border-t pt-4">
                    <p>✓ Free shipping on orders over $75</p>
                    <p>✓ 30-day satisfaction guarantee</p>
                    <p>✓ Handmade in Turks & Caicos Islands</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="usage">How to Use</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <Card className="border-0 shadow-natural">
                <CardContent className="p-8">
                  <h3 className="text-xl font-heading font-semibold mb-4">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.longDescription}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ingredients" className="mt-8">
              <Card className="border-0 shadow-natural">
                <CardContent className="p-8">
                  <h3 className="text-xl font-heading font-semibold mb-4">Natural Ingredients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.ingredients.map((ingredient: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Droplets className="h-4 w-4 text-herb-deep-green" />
                        <span>{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="usage" className="mt-8">
              <Card className="border-0 shadow-natural">
                <CardContent className="p-8">
                  <h3 className="text-xl font-heading font-semibold mb-4">How to Use</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.howToUse}
                  </p>
                  <div className="mt-6 p-4 bg-herb-soft-sage/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sun className="h-4 w-4 text-herb-deep-green" />
                      <span className="font-semibold text-sm">Pro Tip:</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For best results, use as part of a complete natural skincare routine. 
                      Always patch test new products before full application.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-heading font-bold text-brand-brown mb-8 text-center">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(productData)
              .filter(([key]) => key !== id)
              .slice(0, 3)
              .map(([key, relatedProduct]) => (
                <Card key={key} className="group hover:shadow-card transition-smooth border-0 shadow-natural">
                  <div className="relative overflow-hidden">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-smooth"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold mb-2">{relatedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{relatedProduct.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-brand-green">{relatedProduct.price}</span>
                      <Button asChild size="sm">
                        <Link to={`/product/${key}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;