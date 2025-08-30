import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Menu, X, ShoppingBag, User, LogOut, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { name: "Shop", path: "/shop" },
    { name: "Quiz", path: "/quiz" },
    { name: "Build Oil", path: "/build-oil" },
    { name: "Our Story", path: "/story" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-heading text-2xl font-bold text-brand-green">
            HerbMe
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-smooth hover:text-primary",
                  isActive(item.path) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth and Cart Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary">
              <Link to="/cart">
                <ShoppingBag className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center space-x-2 animate-breathe">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="data-[state=checked]:bg-herb-deep-green"
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-muted-foreground hover:text-primary"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="text-muted-foreground hover:text-primary"
              >
                <Link to="/auth">
                  <User className="h-5 w-5 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu and auth buttons */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link to="/cart">
                <ShoppingBag className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* Mobile Dark Mode Toggle */}
            <div className="flex items-center space-x-1 animate-breathe">
              <Sun className="h-3 w-3 text-muted-foreground" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="data-[state=checked]:bg-herb-deep-green scale-75"
              />
              <Moon className="h-3 w-3 text-muted-foreground" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium transition-smooth",
                    isActive(item.path)
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth */}
              <div className="border-t border-border pt-3 mt-3">
                {user ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={signOut}
                    className="w-full justify-start text-muted-foreground hover:text-primary"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="w-full justify-start text-muted-foreground hover:text-primary"
                  >
                    <Link to="/auth">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;