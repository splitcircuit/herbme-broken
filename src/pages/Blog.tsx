import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsletterSignup } from "@/components/ui/newsletter-signup";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import islandStory from "@/assets/island-story.jpg";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Amazing Benefits of Sea Moss for Your Skin",
      excerpt: "Discover why sea moss has become the holy grail ingredient in natural skincare, and how this marine superfood can transform your complexion.",
      image: product1,
      category: "Ingredients",
      date: "March 15, 2024",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "Building Your Natural Skincare Routine",
      excerpt: "Learn how to create an effective natural skincare routine that works with your skin type and lifestyle for optimal results.",
      image: product2,
      category: "Skincare Tips",
      date: "March 12, 2024",
      readTime: "7 min read",
      featured: false
    },
    {
      id: 3,
      title: "Turmeric: Nature's Golden Secret for Glowing Skin",
      excerpt: "Explore the centuries-old beauty secrets of turmeric and how this golden spice can brighten and revitalize your complexion.",
      image: product3,
      category: "Ingredients",
      date: "March 10, 2024",
      readTime: "6 min read",
      featured: false
    },
    {
      id: 4,
      title: "Sustainable Beauty: Our Island Approach",
      excerpt: "Learn about our commitment to sustainable skincare practices and how we protect the natural environment of Turks & Caicos.",
      image: islandStory,
      category: "Sustainability",
      date: "March 8, 2024",
      readTime: "4 min read",
      featured: false
    },
    {
      id: 5,
      title: "Morning vs Evening Skincare: What's the Difference?",
      excerpt: "Understanding when and how to use different natural skincare products for maximum effectiveness throughout the day.",
      image: product1,
      category: "Skincare Tips",
      date: "March 5, 2024",
      readTime: "5 min read",
      featured: false
    },
    {
      id: 6,
      title: "The Science Behind Natural Ingredients",
      excerpt: "Dive deep into the research that supports the effectiveness of natural skincare ingredients like aloe vera and coconut oil.",
      image: product2,
      category: "Education",
      date: "March 3, 2024",
      readTime: "8 min read",
      featured: false
    }
  ];

  const categories = ["All", "Ingredients", "Skincare Tips", "Sustainability", "Education"];
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-brown mb-4">
            Natural Beauty Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the secrets of natural skincare, learn about island ingredients, 
            and get expert tips for healthy, glowing skin.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <Badge className="mb-4 bg-success text-success-foreground">Featured Article</Badge>
            <Card className="overflow-hidden border-0 shadow-card">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-4 border-herb-light-green text-herb-deep-green">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-brown mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <Button className="w-fit bg-primary hover:bg-primary/90">
                    Read Full Article
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className={category === "All" ? "bg-primary hover:bg-primary/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {regularPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-card transition-smooth overflow-hidden border-0 shadow-natural">
              <div className="relative overflow-hidden">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
                <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                  {post.category}
                </Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-heading font-semibold text-brand-brown group-hover:text-primary transition-smooth">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80">
                  Read More
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="text-center bg-herb-soft-sage/30 rounded-2xl p-12">
          <h2 className="text-3xl font-heading font-bold text-brand-brown mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest skincare tips, ingredient spotlights, 
            and exclusive content about natural beauty and island wellness.
          </p>
          <div className="max-w-md mx-auto mb-6">
            <NewsletterSignup 
              placeholder="Enter your email" 
              buttonText="Subscribe"
              source="Blog - Stay Updated"
              tags={['herbme', 'website', 'blog']}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;