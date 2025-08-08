import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, Waves, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import islandStory from "@/assets/island-story.jpg";
import heroImage from "@/assets/hero-skincare.jpg";

const Story = () => {
  const values = [
    {
      icon: Waves,
      title: "Island Pure",
      description: "We source our ingredients from the pristine waters and untouched landscapes of the Turks & Caicos Islands, ensuring the highest quality and purity."
    },
    {
      icon: Heart,
      title: "Handcrafted with Love",
      description: "Every product is carefully handmade in small batches, allowing us to maintain our high standards and personal touch in each jar."
    },
    {
      icon: Leaf,
      title: "100% Natural",
      description: "We believe in the power of nature. Our products contain only natural, plant-based ingredients with no harmful chemicals or synthetic additives."
    },
    {
      icon: Sun,
      title: "Sustainable Practice",
      description: "We work in harmony with our island environment, using sustainable harvesting methods that protect and preserve our natural resources."
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-brown mb-6">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Born from the pristine waters and rich botanical heritage of the Turks & Caicos Islands, 
            HerbMe represents a commitment to pure, natural skincare that honors both tradition and innovation.
          </p>
        </div>

        {/* Main Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-brand-brown">
              From Island Tradition to Modern Wellness
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                HerbMe was born from a deep love for the natural beauty and botanical richness of the 
                Turks & Caicos Islands. Our founder discovered the incredible healing properties of 
                local ingredients like sea moss, turmeric, and aloe vera while exploring the island's 
                traditional wellness practices.
              </p>
              <p>
                What started as a personal journey to create pure, effective skincare became a mission 
                to share the island's natural treasures with the world. Every ingredient we use is 
                carefully sourced from our pristine environment, where crystal-clear waters and 
                unpolluted air create the perfect conditions for the most potent botanicals.
              </p>
              <p>
                Today, we continue to honor the traditional methods passed down through generations 
                while applying modern knowledge of skincare science. Each product is handcrafted in 
                small batches, ensuring that every jar carries the pure essence of island life.
              </p>
            </div>
          </div>
          <div className="relative">
            <img 
              src={islandStory} 
              alt="Beautiful Turks and Caicos landscape"
              className="w-full h-auto rounded-2xl shadow-card"
            />
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-brown mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every decision we make is guided by our core values, rooted in respect for nature and commitment to quality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-natural hover:shadow-card transition-smooth">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-herb-soft-sage rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-brand-green" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-brand-brown">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative order-2 lg:order-1">
            <img 
              src={heroImage} 
              alt="Handcrafted skincare process"
              className="w-full h-auto rounded-2xl shadow-card"
            />
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl font-heading font-bold text-brand-brown">
              Our Handcrafted Process
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Creating HerbMe products is both an art and a science. We begin by carefully 
                harvesting our ingredients at peak potency, often in the early morning when 
                essential oils and nutrients are most concentrated.
              </p>
              <p>
                Our sea moss is hand-picked from the clear, nutrient-rich waters surrounding 
                our islands, while our turmeric and other botanicals are sourced from local 
                growers who share our commitment to organic, sustainable practices.
              </p>
              <p>
                Each batch is then carefully prepared using traditional methods enhanced with 
                modern understanding of ingredient preservation and efficacy. This ensures that 
                every jar retains the full power of our island ingredients.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Leaf className="h-4 w-4 text-brand-green" />
                <span className="text-sm">Hand-harvested at peak potency</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-brand-green" />
                <span className="text-sm">Small batch production for quality control</span>
              </div>
              <div className="flex items-center space-x-2">
                <Waves className="h-4 w-4 text-brand-green" />
                <span className="text-sm">Sustainably sourced from pristine waters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-herb-soft-sage/30 rounded-2xl p-12">
          <h2 className="text-3xl font-heading font-bold text-brand-brown mb-4">
            Experience Island Wellness
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join us on this journey of natural wellness. Discover the transformative power of 
            island-born, plant-powered skincare that brings the essence of paradise to your daily routine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-success hover:bg-success/90 text-success-foreground">
              <Link to="/shop">Shop Our Collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;