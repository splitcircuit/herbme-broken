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
              contents: {
                title: false,
                img: false,
                price: true,
                options: true,
                quantity: true,
                button: true
              },
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
      name: "Watermelon Bombshell",
      price: "$28",
      image: product1,
      tag: "Sunkissed Collection",
      shortDescription: "Luxuriously lightweight yet deeply hydrating body oil",
      longDescription: "Our Watermelon Bombshell body oil is luxuriously lightweight yet deeply hydrating, giving your skin a glowing, moisturized feel that lasts all day. Perfect for those sunny summer days when you want to shine without feeling greasy. Part of our Sunkissed Collection designed to bring ultimate summer vibes.",
      ingredients: ["Watermelon Seed Oil", "Jojoba Oil", "Sweet Almond Oil", "Vitamin E", "Natural Fragrance"],
      howToUse: "Apply to clean, dry skin. Massage gently until absorbed. Perfect for layering with our Foaming Body Scrub and Body Mist for the complete summer experience.",
      skinTypes: ["All Skin Types", "Dry Skin", "Normal Skin", "Summer Care"],
      benefits: ["Deep Hydration", "Glowing Skin", "Non-Greasy", "Long-Lasting Moisture"]
    },
    "2": {
      name: "Body Juice",
      price: "$26",
      image: product2,
      tag: "Sunkissed Collection",
      shortDescription: "Hydrating body essence for glowing, moisturized skin",
      longDescription: "Our Body Juice is a hydrating body essence that gives your skin a glowing, moisturized feel that lasts all day. This lightweight formula absorbs quickly while providing deep nourishment. Perfect for those sunny summer days when you want healthy, radiant skin. Part of our Sunkissed Collection designed to bring ultimate summer vibes.",
      ingredients: ["Aloe Vera Extract", "Hyaluronic Acid", "Watermelon Extract", "Glycerin", "Natural Moisturizers"],
      howToUse: "Apply to clean, damp skin. Massage gently until absorbed. Can be used alone or layered under Watermelon Bombshell body oil for extra hydration.",
      skinTypes: ["All Skin Types", "Dehydrated Skin", "Normal Skin", "Combination Skin"],
      benefits: ["Deep Hydration", "Glowing Skin", "Quick Absorption", "Lightweight Feel"]
    },
    "3": {
      name: "Foaming Body Scrub",
      price: "$32",
      image: product3,
      tag: "Sunkissed Collection",
      shortDescription: "5-in-one shower essential that foams, exfoliates, cleanses, hydrates, and softens",
      longDescription: "Our Foaming Body Scrub is a 5-in-one shower essential that foams, exfoliates, cleanses, hydrates, and softens your skin all in one step. This convenient formula saves you money and shower space compared to buying separate soap and scrub products. Part of our Sunkissed Collection for ultimate summer vibes.",
      ingredients: ["Watermelon Extract", "Sugar Crystals", "Coconut Oil", "Shea Butter", "Natural Foaming Agents", "Vitamin C"],
      howToUse: "Apply to wet skin in circular motions. The formula will foam and exfoliate simultaneously. Rinse thoroughly. Follow with Body Juice or Watermelon Bombshell body oil for best results.",
      skinTypes: ["All Skin Types", "Rough Skin", "Dull Skin", "Normal Skin"],
      benefits: ["Exfoliates", "Cleanses", "Hydrates", "Softens", "Space-Saving"]
    },
    "4": {
      name: "Body Mist",
      price: "$24",
      image: product1,
      tag: "Sunkissed Collection",
      shortDescription: "Juicy, sweet, and refreshing scent for long-lasting summer fragrance",
      longDescription: "Our Body Mist features a juicy, sweet, and refreshing watermelon scent that captures the essence of summer. Perfect for layering with the Foaming Body Scrub, Body Juice, and Watermelon Bombshell body oil for a long-lasting summer fragrance experience. Part of our Sunkissed Collection designed to bring ultimate summer vibes.",
      ingredients: ["Watermelon Fragrance", "Aloe Vera", "Rose Water", "Glycerin", "Natural Preservatives"],
      howToUse: "Spray on pulse points and body as desired. Layer with our Body Juice and Watermelon Bombshell body oil, and use after our Foaming Body Scrub for the complete Sunkissed Collection experience.",
      skinTypes: ["All Skin Types", "Sensitive Skin", "Normal Skin", "Fragrance Lovers"],
      benefits: ["Refreshing Scent", "Long-Lasting", "Layerable", "Summer Vibes"]
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