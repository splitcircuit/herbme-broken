import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Leaf, Heart, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-skincare.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import islandStory from "@/assets/island-story.jpg";

const Index = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Sea Moss Recovery Cream",
      price: "$45",
      image: product1,
      tag: "Best Seller"
    },
    {
      id: 2,
      name: "Turmeric Brightening Serum",
      price: "$38",
      image: product2,
      tag: "New"
    },
    {
      id: 3,
      name: "Aloe Gentle Cleanser",
      price: "$28",
      image: product3,
      tag: "Sensitive Skin"
    }
  ];

  const benefits = [
    { icon: Leaf, title: "100% Natural", description: "Pure plant-based ingredients" },
    { icon: Heart, title: "Handcrafted", description: "Made with love in small batches" },
    { icon: Award, title: "Island Fresh", description: "Harvested from Turks & Caicos" }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "The sea moss cream has completely transformed my skin. So hydrating and natural!"
    },
    {
      name: "Jessica L.",
      rating: 5,
      text: "Love knowing exactly what's in my skincare. These products are pure magic."
    },
    {
      name: "Maria C.",
      rating: 5,
      text: "Finally found skincare that works with my sensitive skin. Thank you HerbMe!"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-herb-soft-sage/20 to-herb-light-green/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-12">
            <div className="space-y-8">
              <div>
                <Badge variant="secondary" className="mb-4">
                  Handmade in Turks & Caicos
                </Badge>
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-brand-brown leading-tight">
                  Island-born.
                  <br />
                  <span className="text-brand-green">Plant-powered.</span>
                </h1>
                <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
                  Discover the power of nature with our handcrafted skincare, infused with pristine sea moss, 
                  golden turmeric, and tropical botanicals from the beautiful Turks & Caicos Islands.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-success hover:bg-success/90 text-success-foreground">
                  <Link to="/shop">Shop Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/story">Our Story</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Natural skincare products with tropical botanicals"
                className="w-full h-auto rounded-2xl shadow-card"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-herb-soft-sage rounded-full flex items-center justify-center mx-auto">
                  <benefit.icon className="h-8 w-8 text-brand-green" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-brand-brown">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-herb-soft-sage/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-brown mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most loved skincare essentials, crafted with the finest natural ingredients
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
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
                  <h3 className="text-xl font-heading font-semibold text-brand-brown">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-brand-green">{product.price}</span>
                    <Button asChild variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                      <Link to={`/product/${product.id}`}>View Product</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Story Callout */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-brown">
                Rooted in Island Tradition
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every jar tells a story of pristine waters, untouched coral reefs, and botanical treasures 
                found only in the Turks & Caicos Islands. Our small-batch approach ensures each product 
                carries the pure essence of island life.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/story">Discover Our Story</Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src={islandStory} 
                alt="Beautiful Turks and Caicos landscape"
                className="w-full h-auto rounded-2xl shadow-card"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-herb-soft-sage/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-brown mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Real results from real people who love natural skincare
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="border-0 shadow-natural">
                <CardContent className="p-6 space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{review.text}"</p>
                  <p className="font-semibold text-brand-brown">- {review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-brown mb-4">
            Join the HerbMe Family
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get exclusive access to new products, skincare tips, and island-inspired wellness content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button size="lg" className="bg-success hover:bg-success/90 text-success-foreground">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;