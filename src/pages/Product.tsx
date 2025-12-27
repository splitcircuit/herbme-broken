import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Leaf, Droplets, Sun, Sparkles } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getProductById } from "@/data/products";

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
  const navigate = useNavigate();

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
                price: false,
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
  
  const product = getProductById(id || "");

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
                <span className="text-3xl font-bold text-brand-green">${product.price}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${
                      product.rating && i < Math.floor(product.rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-muted-foreground'
                    }`} />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Skin Type Badges */}
            <div>
              <h3 className="font-heading font-semibold mb-3">Perfect For:</h3>
              <div className="flex flex-wrap gap-2">
                {product.skinTypes.map((type: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-herb-light-green text-herb-deep-green capitalize">
                    {type} skin
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

              {/* Analyze Ingredients CTA */}
              {product.ingredients && product.ingredients.length > 0 && (
                <Card className="border-dashed bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Check ingredients for triggers</p>
                        <p className="text-xs text-muted-foreground">Scan with our Skin Intelligence Scanner</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const ingredientsList = product.ingredients.map(i => i.name).join(', ');
                          navigate(`/scan?prefill=${encodeURIComponent(ingredientsList)}`);
                        }}
                      >
                        Analyze
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ingredients" className="mt-8">
              <Card className="border-0 shadow-natural">
                <CardContent className="p-8">
                  <h3 className="text-xl font-heading font-semibold mb-4">Natural Ingredients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.ingredients.map((ingredient, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Droplets className="h-4 w-4 text-herb-deep-green" />
                        <span>{ingredient.name}</span>
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
            {/* We can add related products logic here later */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;