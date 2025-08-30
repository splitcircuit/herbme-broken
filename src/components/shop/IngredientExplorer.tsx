import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Ingredient } from '@/types/product';

interface IngredientExplorerProps {
  ingredients: Ingredient[];
  title?: string;
}

export const IngredientExplorer = ({ ingredients, title = "Key Ingredients" }: IngredientExplorerProps) => {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const getIngredientTypeColor = (type: string) => {
    switch (type) {
      case 'oil':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'extract':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'essential-oil':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'active':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'base':
        return 'bg-muted text-foreground hover:bg-muted/80';
      default:
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold text-brand-brown">{title}</h3>
      
      {/* Interactive ingredient badges */}
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient, idx) => (
          <HoverCard key={idx}>
            <HoverCardTrigger asChild>
              <Badge
                className={`cursor-pointer transition-all duration-200 ${getIngredientTypeColor(ingredient.type)}`}
                onClick={() => setSelectedIngredient(ingredient)}
              >
                {ingredient.name}
                {ingredient.percentage && (
                  <span className="ml-1 opacity-75">
                    {ingredient.percentage}%
                  </span>
                )}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-brand-brown">{ingredient.name}</h4>
                  <p className="text-xs text-muted-foreground capitalize">
                    {ingredient.type.replace('-', ' ')}
                    {ingredient.percentage && ` • ${ingredient.percentage}%`}
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {ingredient.description}
                </p>
                
                <div>
                  <h5 className="text-sm font-medium mb-2">Benefits:</h5>
                  <div className="flex flex-wrap gap-1">
                    {ingredient.benefits.map((benefit, benefitIdx) => (
                      <Badge 
                        key={benefitIdx} 
                        variant="outline" 
                        className="text-xs"
                      >
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      {/* Detailed view of selected ingredient */}
      {selectedIngredient && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/30">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h4 className="font-heading text-lg font-semibold text-brand-brown">
                  {selectedIngredient.name}
                </h4>
                <Badge className={getIngredientTypeColor(selectedIngredient.type)}>
                  {selectedIngredient.type.replace('-', ' ')}
                </Badge>
                {selectedIngredient.percentage && (
                  <Badge variant="outline">
                    {selectedIngredient.percentage}%
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground">
                {selectedIngredient.description}
              </p>
              
              <div>
                <h5 className="font-medium mb-2 text-brand-brown">Key Benefits:</h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedIngredient.benefits.map((benefit, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-center text-sm text-muted-foreground"
                    >
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ingredient type legend */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        <span className="text-sm text-muted-foreground mr-2">Types:</span>
        {['oil', 'extract', 'essential-oil', 'active', 'base'].map(type => (
          <Badge 
            key={type} 
            className={`text-xs ${getIngredientTypeColor(type)}`}
          >
            {type.replace('-', ' ')}
          </Badge>
        ))}
      </div>
    </div>
  );
};