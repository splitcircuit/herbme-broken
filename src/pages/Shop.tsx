import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3, List, Heart, Clock } from 'lucide-react';
import { products } from '@/data/products';
import { useProductFilter } from '@/hooks/useProductFilter';
import { ProductFilters } from '@/components/shop/ProductFilters';
import { ProductCard } from '@/components/shop/ProductCard';
import { IngredientExplorer } from '@/components/shop/IngredientExplorer';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import { getProductById } from '@/data/products';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price-low' | 'price-high' | 'rating' | 'new';

const Shop = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [activeTab, setActiveTab] = useState('all-products');
  
  const { 
    filter, 
    filteredProducts, 
    updateFilter, 
    resetFilter, 
    hasActiveFilters,
    productCount,
    totalProducts
  } = useProductFilter(products);
  
  const { wishlistItems } = useWishlist();
  const { recentlyViewed } = useRecentlyViewed();

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'new':
        return Number(b.newProduct) - Number(a.newProduct);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Get wishlist products
  const wishlistProducts = wishlistItems
    .map(id => getProductById(id))
    .filter(Boolean);

  // Get recently viewed products
  const recentlyViewedProducts = recentlyViewed
    .map(id => getProductById(id))
    .filter(Boolean);

  // Get all unique ingredients from featured products
  const allIngredients = products
    .filter(p => p.featured)
    .flatMap(p => p.ingredients)
    .filter((ingredient, index, self) => 
      index === self.findIndex(i => i.name === ingredient.name)
    )
    .slice(0, 8);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-brown mb-4">
            Sunkissed Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover our complete Sunkissed Collection of handcrafted skincare products, each designed to bring 
            ultimate summer vibes with the finest natural ingredients from the Turks & Caicos Islands.
          </p>
          
          {/* Active filters indicator */}
          {hasActiveFilters && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary">
                {productCount} of {totalProducts} products
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilter}
                className="text-xs"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-products">All Products</TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist ({wishlistItems.length})
            </TabsTrigger>
            <TabsTrigger value="recently-viewed" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recently Viewed
            </TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          </TabsList>

          {/* All Products Tab */}
          <TabsContent value="all-products" className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <ProductFilters
                filter={filter}
                onFilterChange={updateFilter}
                onReset={resetFilter}
                hasActiveFilters={hasActiveFilters}
                productCount={productCount}
                totalProducts={totalProducts}
              />

              {/* Main Products Area */}
              <div className="flex-1">
                {/* Sort & View Controls */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground hidden lg:block">
                    Showing {productCount} of {totalProducts} products
                  </p>
                  
                  <div className="flex items-center gap-4">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Sort by:</span>
                      <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name A-Z</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="new">New Products</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex border rounded-md">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="rounded-r-none"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                {productCount === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground mb-4">
                      No products found matching your filters.
                    </p>
                    <Button onClick={resetFilter}>Clear Filters</Button>
                  </div>
                ) : (
                  <div className={`grid gap-8 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {sortedProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-8">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-heading font-semibold mb-2">Your Wishlist is Empty</h3>
                <p className="text-muted-foreground mb-6">
                  Save products you love for later by clicking the heart icon.
                </p>
                <Button onClick={() => setActiveTab('all-products')}>
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlistProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Recently Viewed Tab */}
          <TabsContent value="recently-viewed" className="space-y-8">
            {recentlyViewedProducts.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-heading font-semibold mb-2">No Recently Viewed Products</h3>
                <p className="text-muted-foreground mb-6">
                  Products you've recently viewed will appear here.
                </p>
                <Button onClick={() => setActiveTab('all-products')}>
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentlyViewedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Ingredients Tab */}
          <TabsContent value="ingredients" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-brand-brown mb-4">
                  Explore Our Natural Ingredients
                </h2>
                <p className="text-lg text-muted-foreground">
                  Discover the powerful botanicals and natural actives that make our products so effective.
                </p>
              </div>
              
              <IngredientExplorer 
                ingredients={allIngredients}
                title="Featured Ingredients in Our Collection"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-herb-soft-sage/30 rounded-2xl">
          <h2 className="text-2xl font-heading font-bold text-brand-brown mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-muted-foreground mb-6">
            Not sure which products are right for your skin? Get in touch and we'll help you create 
            the perfect natural skincare routine.
          </p>
          <Button size="lg" variant="outline">
            Get Skincare Advice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shop;