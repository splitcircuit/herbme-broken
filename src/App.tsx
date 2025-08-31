import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { LocationProvider } from "@/components/shop/LocationDetector";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { PayPalProvider } from "@/components/shop/PayPalProvider";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Quiz from "./pages/Quiz";
import BuildOil from "./pages/BuildOil";
import Product from "./pages/Product";
import Story from "./pages/Story";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AccessibilityProvider>
        <TooltipProvider>
          <PayPalProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <AuthProvider>
              <LocationProvider>
                <CartProvider>
                  <WishlistProvider>
                    <RecentlyViewedProvider>
                    <div className="min-h-screen flex flex-col">
                  <Navigation />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/quiz" element={<Quiz />} />
                      <Route path="/build-oil" element={<BuildOil />} />
                      <Route path="/product/:id" element={<Product />} />
                      <Route path="/story" element={<Story />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                    </div>
                    </RecentlyViewedProvider>
                  </WishlistProvider>
                </CartProvider>
              </LocationProvider>
            </AuthProvider>
          </BrowserRouter>
          </PayPalProvider>
          </TooltipProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );

export default App;
