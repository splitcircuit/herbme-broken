import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  FlaskConical,
  AlertTriangle,
  Info,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";

interface IngredientData {
  id: string;
  name: string;
  slug: string;
  aliases: string[];
  categories: string[];
  severity: number;
  notes: string;
  common_products: string[];
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

const categoryDescriptions: Record<string, string> = {
  irritant: "May cause redness, stinging, or irritation, especially for sensitive skin.",
  allergen: "Has potential to trigger allergic reactions in susceptible individuals.",
  barrier_disruptor: "May weaken the skin's protective barrier, leading to dryness and sensitivity.",
  acne_trigger: "May contribute to acne breakouts, especially for acne-prone skin.",
  comedogenic: "May clog pores and cause blackheads or whiteheads.",
  sensitizer: "May cause skin to become more reactive over time with repeated exposure.",
  photosensitivity: "May increase skin's sensitivity to sun, raising risk of burns and damage.",
  inflammation: "May promote inflammatory responses in the body.",
  glycation: "May accelerate skin aging by damaging collagen and elastin.",
  dairy: "Dairy-derived ingredients may trigger hormonal acne in some individuals.",
};

const severityLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Low Concern", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  2: { label: "Moderate Concern", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  3: { label: "High Concern", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
};

export default function IngredientDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [ingredient, setIngredient] = useState<IngredientData | null>(null);

  useEffect(() => {
    const fetchIngredient = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from("trigger_ingredients")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        setIngredient(data);
      }
      setLoading(false);
    };

    fetchIngredient();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ingredient) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Ingredient not found</h2>
        <p className="text-muted-foreground mb-4">This ingredient may not exist in our database.</p>
        <Link to="/ingredients">
          <Button>Browse All Ingredients</Button>
        </Link>
      </div>
    );
  }

  const severityInfo = severityLabels[ingredient.severity];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-herb-sage/20 via-background to-herb-cream/20 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Link to="/ingredients">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Ingredients
            </Button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-3">
                <FlaskConical className="w-4 h-4" />
                <span className="text-xs font-medium">Ingredient Profile</span>
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                {ingredient.name}
              </h1>
            </div>
            <Badge className={severityInfo.color} variant="secondary">
              {severityInfo.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Aliases */}
        {ingredient.aliases.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Also Known As
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ingredient.aliases.map((alias, i) => (
                  <Badge key={i} variant="outline">
                    {alias}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Concern Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ingredient.categories.map((cat, i) => (
              <div key={cat}>
                {i > 0 && <Separator className="my-4" />}
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {categoryLabels[cat] || cat}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {categoryDescriptions[cat] || "May have potential effects on skin health."}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notes */}
        {ingredient.notes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">About This Ingredient</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{ingredient.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Common Products */}
        {ingredient.common_products.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Commonly Found In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ingredient.common_products.map((product, i) => (
                  <Badge key={i} variant="outline" className="capitalize">
                    {product}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="p-4 bg-secondary/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            This information is educational only and not medical advice. Individual reactions may vary.
            Consult a dermatologist for personalized guidance.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/scan" className="flex-1">
            <Button className="w-full">
              Scan a Product
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/ingredients" className="flex-1">
            <Button variant="outline" className="w-full">
              Browse All Ingredients
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
