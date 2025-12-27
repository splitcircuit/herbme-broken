import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface SampleItem {
  id: string;
  name: string;
  category: string;
  description: string;
  ingredients: string;
}

const SAMPLE_SCANS: SampleItem[] = [
  // Skincare
  {
    id: "skincare-lotion",
    name: "Fragranced Body Lotion",
    category: "Skincare",
    description: "Common drugstore body lotion with fragrance",
    ingredients: "Water, Glycerin, Mineral Oil, Petrolatum, Stearic Acid, Cetyl Alcohol, Glyceryl Stearate, Dimethicone, Fragrance, Methylparaben, Propylparaben, Limonene, Linalool, Benzyl Alcohol, Sodium Lauryl Sulfate, Triethanolamine"
  },
  {
    id: "skincare-cleanser",
    name: "Foaming Face Cleanser",
    category: "Skincare",
    description: "Daily facial cleanser with harsh surfactants",
    ingredients: "Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, PEG-80 Sorbitan Laurate, Sodium Chloride, Fragrance, Citric Acid, Sodium Benzoate, Methylisothiazolinone, DMDM Hydantoin"
  },
  // Makeup
  {
    id: "makeup-foundation",
    name: "Full Coverage Foundation",
    category: "Makeup",
    description: "Long-wear foundation with common irritants",
    ingredients: "Water, Cyclopentasiloxane, Titanium Dioxide, Glycerin, Dimethicone, PEG-10 Dimethicone, Isododecane, Alcohol Denat, Talc, Fragrance, Phenoxyethanol, Methylparaben, Propylparaben, Bismuth Oxychloride, Iron Oxides"
  },
  {
    id: "makeup-mascara",
    name: "Volumizing Mascara",
    category: "Makeup",
    description: "Popular mascara with potential sensitizers",
    ingredients: "Water, Beeswax, Carnauba Wax, Stearic Acid, Triethanolamine, Glyceryl Stearate, Butylene Glycol, VP/VA Copolymer, Phenoxyethanol, Fragrance, Iron Oxides, Formaldehyde Releaser"
  },
  // Sunscreen
  {
    id: "sunscreen-chemical",
    name: "Chemical Sunscreen SPF 50",
    category: "Sunscreen",
    description: "Chemical sunscreen with common UV filters",
    ingredients: "Water, Homosalate, Octinoxate, Octisalate, Oxybenzone, Avobenzone, Glycerin, Alcohol Denat, Dimethicone, Fragrance, Methylparaben, Acrylates Copolymer, Triethanolamine, Benzophenone-3"
  },
  // Fragrance
  {
    id: "fragrance-perfume",
    name: "Designer Eau de Parfum",
    category: "Fragrance",
    description: "Typical perfume with allergen fragrance compounds",
    ingredients: "Alcohol Denat, Parfum, Water, Limonene, Linalool, Citronellol, Geraniol, Coumarin, Eugenol, Benzyl Benzoate, Benzyl Alcohol, Hydroxycitronellal, Cinnamyl Alcohol, Alpha-Isomethyl Ionone"
  },
  // Household
  {
    id: "household-detergent",
    name: "Laundry Detergent",
    category: "Household",
    description: "Scented laundry detergent with surfactants",
    ingredients: "Water, Sodium Laureth Sulfate, Sodium Lauryl Sulfate, Alcohol Ethoxylate, Sodium Carbonate, Sodium Polyacrylate, Fragrance, Limonene, Linalool, Methylisothiazolinone, Optical Brighteners, Sodium Hydroxide"
  },
  {
    id: "household-cleaner",
    name: "Multi-Surface Cleaner",
    category: "Household",
    description: "All-purpose household cleaner",
    ingredients: "Water, Isopropyl Alcohol, Sodium Lauryl Sulfate, Sodium Carbonate, Fragrance, Limonene, Citric Acid, Methylchloroisothiazolinone, Methylisothiazolinone, Colorant Blue 1"
  },
  // Food/Snacks
  {
    id: "food-energy-bar",
    name: "Protein Energy Bar",
    category: "Food",
    description: "Common protein bar with skin-triggering ingredients",
    ingredients: "Whey Protein Concentrate, Milk Chocolate (Sugar, Cocoa Butter, Milk Powder, Soy Lecithin), Corn Syrup, High Fructose Corn Syrup, Soy Protein Isolate, Artificial Flavors, Sucralose, FD&C Red 40, FD&C Yellow 5"
  },
  // Drinks
  {
    id: "drink-energy",
    name: "Energy Drink",
    category: "Drink",
    description: "Popular energy drink with sugar and additives",
    ingredients: "Carbonated Water, High Fructose Corn Syrup, Citric Acid, Natural and Artificial Flavors, Caffeine, Sodium Benzoate, Niacinamide, FD&C Red 40, FD&C Blue 1, Sucralose"
  },
  {
    id: "drink-smoothie",
    name: "Pre-made Protein Smoothie",
    category: "Drink",
    description: "Dairy-based protein shake",
    ingredients: "Milk, Whey Protein Concentrate, Sugar, Cocoa Powder, Corn Syrup Solids, Soy Lecithin, Carrageenan, Natural and Artificial Flavors, Sodium Caseinate, Sucralose"
  },
];

const categoryColors: Record<string, string> = {
  Skincare: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Makeup: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  Sunscreen: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Fragrance: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Household: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Food: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Drink: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
};

interface SampleScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSample: (sample: SampleItem) => void;
}

export function SampleScanModal({ open, onOpenChange, onSelectSample }: SampleScanModalProps) {
  const handleSelect = (sample: SampleItem) => {
    onSelectSample(sample);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Sample Scans</DialogTitle>
          <DialogDescription>
            Pick one to auto-fill the scanner.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="px-6 pb-6 max-h-[60vh]">
          <div className="space-y-3">
            {SAMPLE_SCANS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelect(sample)}
                className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-foreground text-sm">
                        {sample.name}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${categoryColors[sample.category] || ""}`}
                      >
                        {sample.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {sample.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Use
                  </Button>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
