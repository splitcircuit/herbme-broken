import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Filter, X, FlaskConical, ChevronRight } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  slug: string;
  categories: string[];
  severity: number;
  notes: string;
}

const categoryLabels: Record<string, string> = {
  irritant: "Irritant",
  allergen: "Allergen",
  barrier_disruptor: "Barrier Disruptor",
  acne_trigger: "Acne Trigger",
  comedogenic: "Comedogenic",
  sensitizer: "Sensitizer",
  photosensitivity: "Photosensitivity",
  inflammation: "Inflammation",
  glycation: "Glycation",
  dairy: "Dairy",
};

const allCategories = Object.keys(categoryLabels);

const severityColors: Record<number, string> = {
  1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  2: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  3: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function Ingredients() {
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      const { data, error } = await supabase
        .from("trigger_ingredients")
        .select("id, name, slug, categories, severity, notes")
        .order("name");

      if (!error && data) {
        setIngredients(data);
      }
      setLoading(false);
    };

    fetchIngredients();
  }, []);

  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ingredient) => {
      const matchesSearch =
        search === "" ||
        ingredient.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) => ingredient.categories.includes(cat));

      return matchesSearch && matchesCategory;
    });
  }, [ingredients, search, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearch("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-herb-sage/20 via-background to-herb-cream/20 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <FlaskConical className="w-4 h-4" />
            <span className="text-sm font-medium">Ingredient Database</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Browse Skin Triggers
          </h1>
          <p className="text-muted-foreground">
            Explore our database of {ingredients.length}+ ingredients that may affect your skin
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Filter by Category</span>
                {selectedCategories.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={selectedCategories.includes(cat) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(cat)}
                  >
                    {categoryLabels[cat]}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredIngredients.length} ingredient{filteredIngredients.length !== 1 ? "s" : ""}
        </p>

        {/* List */}
        <div className="space-y-3">
          {filteredIngredients.map((ingredient) => (
            <Link key={ingredient.id} to={`/ingredients/${ingredient.slug}`}>
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{ingredient.name}</span>
                      <Badge className={severityColors[ingredient.severity]} variant="secondary">
                        {ingredient.severity === 3
                          ? "High"
                          : ingredient.severity === 2
                          ? "Med"
                          : "Low"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {ingredient.notes}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ingredient.categories.slice(0, 3).map((cat) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {categoryLabels[cat] || cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredIngredients.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No ingredients found matching your criteria</p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
