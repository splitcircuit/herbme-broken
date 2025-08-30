import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Heart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
    addToRecentlyViewed(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: 'product'
    });
  };

  const handleProductClick = () => {
    addToRecentlyViewed(product.id);
  };

  return (
    <>
      <Card className="group hover:shadow-card transition-smooth overflow-hidden border-0 shadow-natural relative">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <Badge className="bg-success text-success-foreground">
            {product.tag}
          </Badge>
          {product.newProduct && (
            <Badge variant="secondary">New</Badge>
          )}
          {product.originalPrice && (
            <Badge variant="destructive">Sale</Badge>
          )}
        </div>

        {/* Wishlist & Quick View */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                inWishlist ? 'fill-red-500 text-red-500' : ''
              }`} 
            />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        <Link to={`/product/${product.id}`} onClick={handleProductClick}>
          <div className="relative overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-80 object-cover group-hover:scale-105 transition-smooth"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary">Out of Stock</Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-heading font-semibold text-brand-brown mb-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.shortDescription}
              </p>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating!) 
                            ? 'text-yellow-400 fill-current' 
                             : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
              )}

              {/* Skin Types */}
              <div className="flex flex-wrap gap-1 mb-3">
                {product.skinTypes.slice(0, 3).map(type => (
                  <Badge key={type} variant="outline" className="text-xs capitalize">
                    {type}
                  </Badge>
                ))}
                {product.skinTypes.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.skinTypes.length - 3}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-brand-green">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90"
                disabled={!product.inStock}
              >
                View Product
              </Button>
            </div>
          </CardContent>
        </Link>

        {/* Quick Add to Cart - appears on hover */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            disabled={!product.inStock}
          >
            Quick Add to Cart
          </Button>
        </div>
      </Card>

      {/* Quick View Dialog */}
      <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Images */}
            <div className="space-y-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {product.images.slice(0, 3).map((image, idx) => (
                    <img 
                      key={idx}
                      src={image} 
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <Badge className="mb-2">{product.tag}</Badge>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-brand-green">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating!) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground">{product.description}</p>

              {/* Skin Types & Concerns */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Suitable for:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.skinTypes.map(type => (
                      <Badge key={type} variant="secondary" className="capitalize">
                        {type} skin
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Addresses:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.skinConcerns.map(concern => (
                      <Badge key={concern} variant="outline" className="capitalize">
                        {concern}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div>
                <h4 className="font-semibold mb-2">Key Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {product.benefits.slice(0, 3).map((benefit, idx) => (
                    <li key={idx}>• {benefit}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1"
                  disabled={!product.inStock}
                >
                  Add to Cart
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="flex-1"
                >
                  <Link to={`/product/${product.id}`}>
                    View Full Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};