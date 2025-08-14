import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="font-heading text-2xl font-bold text-brand-green">
              HerbMe
            </Link>
            <p className="text-sm text-muted-foreground">
              Island-born. Plant-powered. Handmade natural skincare from Turks & Caicos Islands.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Shop</Link></li>
              <li><Link to="/story" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Our Story</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Blog</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Shipping Info</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Returns</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Size Guide</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Connect</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Providenciales, Turks and Caicos Islands</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:herbmecontact@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  herbmecontact@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Instagram className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="https://www.instagram.com/herbmeofficial/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  @HerbMeOfficial
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 HerbMe. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;