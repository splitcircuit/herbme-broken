import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const Shop = () => {
  const products = [
    {
      id: 1,
      name: "Watermelon Bombshell",
      price: "$28",
      image: product1,
      tag: "Sunkissed Collection",
      description: "Luxuriously lightweight yet deeply hydrating body oil"
    },
    {
      id: 2,
      name: "Foaming Body Scrub",
      price: "$32",
      image: product2,
      tag: "Sunkissed Collection",
      description: "5-in-one shower essential that foams, exfoliates, cleanses, hydrates, and softens"
    },
    {
      id: 3,
      name: "Body Mist",
      price: "$24",
      image: product3,
      tag: "Sunkissed Collection",
      description: "Juicy, sweet, and refreshing scent for long-lasting summer fragrance"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-brown mb-4">
            Sunkissed Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our complete Sunkissed Collection of handcrafted skincare products, each designed to bring 
            ultimate summer vibes with the finest natural ingredients from the Turks & Caicos Islands.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-card transition-smooth overflow-hidden border-0 shadow-natural">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-smooth"
                />
                <Badge className="absolute top-4 left-4 bg-success text-success-foreground">
                  {product.tag}
                </Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-heading font-semibold text-brand-brown mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-brand-green">{product.price}</span>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link to={`/product/${product.id}`}>View Product</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-herb-soft-sage/30 rounded-2xl">
          <h2 className="text-2xl font-heading font-bold text-brand-brown mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-muted-foreground mb-6">
            Not sure which products are right for your skin? Get in touch and we'll help you create 
            the perfect natural skincare routine.
          </p>
          <Button asChild size="lg" variant="outline">
            <Link to="/contact">Get Skincare Advice</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shop;