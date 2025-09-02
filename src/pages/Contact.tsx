import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Phone, Instagram, Clock, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import islandStory from "@/assets/island-story.jpg";

const Contact = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "All fields are required to send your message.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message sent successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error: any) {
      console.error('Error sending contact form:', error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-brown mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-heading font-bold text-brand-brown mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input 
                        id="name" 
                        name="name"
                        placeholder="Your full name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="your@email.com" 
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input 
                      id="subject" 
                      name="subject"
                      placeholder="What's this about?" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-success hover:bg-success/90 text-success-foreground" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="border-0 shadow-natural">
              <CardContent className="p-8">
                <h2 className="text-2xl font-heading font-bold text-brand-brown mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 text-brand-green mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground">
                        Providenciales<br />
                        Turks and Caicos Islands
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="h-5 w-5 text-brand-green mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Email</h3>
                      <div className="flex items-center justify-between group">
                        {isMobile ? (
                          <a 
                            href="mailto:herbmecontact@gmail.com" 
                            className="text-muted-foreground hover:text-primary transition-smooth"
                          >
                            herbmecontact@gmail.com
                          </a>
                        ) : (
                          <button
                            onClick={() => copyToClipboard("herbmecontact@gmail.com", "Email")}
                            className="text-muted-foreground hover:text-primary transition-smooth text-left"
                          >
                            herbmecontact@gmail.com
                          </button>
                        )}
                        {!isMobile && (
                          <button
                            onClick={() => copyToClipboard("herbmecontact@gmail.com", "Email")}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                          >
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="h-5 w-5 text-brand-green mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <div className="flex items-center justify-between group">
                        {isMobile ? (
                          <a 
                            href="tel:6492461597" 
                            className="text-muted-foreground hover:text-primary transition-smooth"
                          >
                            (649) 246-1597
                          </a>
                        ) : (
                          <button
                            onClick={() => copyToClipboard("6492461597", "Phone number")}
                            className="text-muted-foreground hover:text-primary transition-smooth text-left"
                          >
                            (649) 246-1597
                          </button>
                        )}
                        {!isMobile && (
                          <button
                            onClick={() => copyToClipboard("6492461597", "Phone number")}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                          >
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="h-5 w-5 text-brand-green mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                        <p>Saturday: 10:00 AM - 2:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-0 shadow-natural">
              <CardContent className="p-8">
                <h2 className="text-2xl font-heading font-bold text-brand-brown mb-6">
                  Follow Our Journey
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Instagram className="h-5 w-5 text-brand-green" />
                    <div>
                      <h3 className="font-semibold">Instagram</h3>
                      <a 
                        href="https://www.instagram.com/herbmeofficial/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-smooth"
                      >
                        @HerbMeOfficial
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Follow us for behind-the-scenes content, skincare tips, and beautiful 
                    island inspiration from our home in Turks & Caicos.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Island Image */}
            <div className="relative">
              <img 
                src={islandStory} 
                alt="Beautiful Turks and Caicos Islands"
                className="w-full h-64 object-cover rounded-2xl shadow-card"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-heading font-bold mb-2">
                    Visit Our Island Home
                  </h3>
                  <p className="text-sm opacity-90">
                    Experience the source of our inspiration in the beautiful Turks & Caicos Islands
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-brand-brown mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Quick answers to common questions about our products and services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-natural">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-3">How are your products made?</h3>
                <p className="text-muted-foreground text-sm">
                  All our products are handcrafted in small batches using traditional methods 
                  and the finest natural ingredients sourced from the Turks & Caicos Islands.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-natural">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-3">What makes your ingredients special?</h3>
                <p className="text-muted-foreground text-sm">
                  Our ingredients are sourced from the pristine waters and untouched landscapes 
                  of our island home, ensuring the highest quality and potency.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-natural">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-3">Are your products suitable for sensitive skin?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Our products are made with gentle, natural ingredients and are suitable 
                  for most skin types, including sensitive skin. We recommend patch testing first.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-natural">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-3">Do you ship internationally?</h3>
                <p className="text-muted-foreground text-sm">
                  We currently ship throughout the Caribbean and North America. 
                  Contact us for information about shipping to other locations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;