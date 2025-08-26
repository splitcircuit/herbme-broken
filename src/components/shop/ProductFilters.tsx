import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { ProductFilter } from '@/types/product';

interface ProductFiltersProps {
  filter: ProductFilter;
  onFilterChange: (filter: Partial<ProductFilter>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  productCount: number;
  totalProducts: number;
}

const skinTypes = [
  { id: 'dry', label: 'Dry' },
  { id: 'oily', label: 'Oily' },
  { id: 'combination', label: 'Combination' },
  { id: 'sensitive', label: 'Sensitive' },
  { id: 'normal', label: 'Normal' }
];

const skinConcerns = [
  { id: 'acne', label: 'Acne' },
  { id: 'aging', label: 'Aging' },
  { id: 'dryness', label: 'Dryness' },
  { id: 'oiliness', label: 'Oiliness' },
  { id: 'sensitivity', label: 'Sensitivity' },
  { id: 'dullness', label: 'Dullness' },
  { id: 'pigmentation', label: 'Pigmentation' },
  { id: 'pores', label: 'Large Pores' }
];

const categories = [
  { id: 'body-oil', label: 'Body Oils' },
  { id: 'body-scrub', label: 'Body Scrubs' },
  { id: 'body-mist', label: 'Body Mists' },
  { id: 'cleanser', label: 'Cleansers' },
  { id: 'moisturizer', label: 'Moisturizers' }
];

export const ProductFilters = ({ 
  filter, 
  onFilterChange, 
  onReset, 
  hasActiveFilters, 
  productCount, 
  totalProducts 
}: ProductFiltersProps) => {
  const [openSections, setOpenSections] = useState({
    skinType: true,
    concerns: true,
    category: false,
    price: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleArrayToggle = (
    array: string[], 
    value: string, 
    key: 'skinTypes' | 'skinConcerns' | 'categories'
  ) => {
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    onFilterChange({ [key]: newArray });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Products</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="search"
            placeholder="Search by name, ingredient, benefit..."
            value={filter.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Skin Type Filter */}
      <Collapsible open={openSections.skinType} onOpenChange={() => toggleSection('skinType')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-secondary rounded-md">
          <Label className="font-medium">Skin Type</Label>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.skinType ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-2">
          {skinTypes.map(type => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={filter.skinTypes.includes(type.id)}
                onCheckedChange={() => handleArrayToggle(filter.skinTypes, type.id, 'skinTypes')}
              />
              <Label htmlFor={type.id} className="text-sm font-normal cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Skin Concerns Filter */}
      <Collapsible open={openSections.concerns} onOpenChange={() => toggleSection('concerns')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-secondary rounded-md">
          <Label className="font-medium">Skin Concerns</Label>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.concerns ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-2">
          {skinConcerns.map(concern => (
            <div key={concern.id} className="flex items-center space-x-2">
              <Checkbox
                id={concern.id}
                checked={filter.skinConcerns.includes(concern.id)}
                onCheckedChange={() => handleArrayToggle(filter.skinConcerns, concern.id, 'skinConcerns')}
              />
              <Label htmlFor={concern.id} className="text-sm font-normal cursor-pointer">
                {concern.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Category Filter */}
      <Collapsible open={openSections.category} onOpenChange={() => toggleSection('category')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-secondary rounded-md">
          <Label className="font-medium">Category</Label>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.category ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-2">
          {categories.map(category => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={filter.categories.includes(category.id)}
                onCheckedChange={() => handleArrayToggle(filter.categories, category.id, 'categories')}
              />
              <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer">
                {category.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-secondary rounded-md">
          <Label className="font-medium">Price Range</Label>
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-2">
          <div className="px-2">
            <Slider
              value={filter.priceRange}
              onValueChange={(value) => onFilterChange({ priceRange: value as [number, number] })}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>${filter.priceRange[0]}</span>
              <span>${filter.priceRange[1]}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* In Stock Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={filter.inStock}
          onCheckedChange={(checked) => onFilterChange({ inStock: checked as boolean })}
        />
        <Label htmlFor="inStock" className="text-sm font-normal cursor-pointer">
          In stock only
        </Label>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          onClick={onReset}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Sheet */}
      <Sheet>
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <div className="flex items-center gap-4">
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {filter.skinTypes.length + filter.skinConcerns.length + filter.categories.length + 
                     (filter.search ? 1 : 0) + (filter.inStock ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <p className="text-sm text-muted-foreground">
              {productCount} of {totalProducts} products
            </p>
          </div>
        </div>

        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filter Products</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block w-80 bg-card border-r p-6 h-fit sticky top-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-semibold">Filters</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset} className="text-xs">
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <FilterContent />
      </div>
    </>
  );
};