import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Droplets, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface BaseOil {
  name: string;
  percentage: number;
  benefits: string[];
  price_per_ml: number;
}

interface CustomBlend {
  blend_name: string;
  base_oils: Record<string, number>;
  boost_ingredients: string[];
  scent: string;
  custom_scent: string;
  bottle_size: string;
  total_price: number;
}

const BuildOil = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBaseOils, setSelectedBaseOils] = useState<BaseOil[]>([]);
  const [boostIngredients, setBoostIngredients] = useState<string[]>([]);
  const [scent, setScent] = useState('');
  const [customScent, setCustomScent] = useState('');
  const [blendName, setBlendName] = useState('');
  const [bottleSize, setBottleSize] = useState('30ml');
  const [totalPrice, setTotalPrice] = useState(0);
  const [allergens, setAllergens] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const baseOilOptions = [
    { 
      name: 'Sweet Almond Oil', 
      benefits: ['Moisturizing', 'Gentle', 'Anti-inflammatory'], 
      price_per_ml: 0.15,
      allergens: ['nuts']
    },
    { 
      name: 'Avocado Oil', 
      benefits: ['Deep hydration', 'Rich in vitamins', 'Anti-aging'], 
      price_per_ml: 0.25,
      allergens: []
    },
    { 
      name: 'Sunflower Oil', 
      benefits: ['Lightweight', 'Non-comedogenic', 'Vitamin E'], 
      price_per_ml: 0.10,
      allergens: []
    },
    { 
      name: 'Jojoba Oil', 
      benefits: ['Balancing', 'Long-lasting', 'Similar to skin sebum'], 
      price_per_ml: 0.35,
      allergens: []
    },
    { 
      name: 'Grapeseed Oil', 
      benefits: ['Light texture', 'Antioxidants', 'Quick absorption'], 
      price_per_ml: 0.20,
      allergens: []
    },
    { 
      name: 'Coconut Oil', 
      benefits: ['Antimicrobial', 'Tropical scent', 'Moisturizing'], 
      price_per_ml: 0.12,
      allergens: ['coconut']
    }
  ];

  const boostOptions = [
    { name: 'Rosehip Oil', price: 8.00, benefits: ['Anti-aging', 'Vitamin C', 'Skin repair'] },
    { name: 'Argan Oil', price: 12.00, benefits: ['Hydrating', 'Anti-aging', 'Hair and skin'] },
    { name: 'Hemp Seed Oil', price: 10.00, benefits: ['Balancing', 'Omega fatty acids', 'Non-comedogenic'] },
    { name: 'Castor Oil', price: 6.00, benefits: ['Thickening', 'Hair growth', 'Moisturizing'] },
    { name: 'Vitamin E', price: 5.00, benefits: ['Antioxidant', 'Preservative', 'Skin healing'] },
    { name: 'Essential Oils', price: 15.00, benefits: ['Aromatherapy', 'Natural fragrance', 'Therapeutic'], allergens: ['essential oils'] }
  ];

  const scentOptions = [
    'Unscented',
    'Lavender', 
    'Peppermint',
    'Vanilla',
    'Citrus Blend',
    'Custom scent'
  ];

  const bottleSizes = [
    { size: '30ml', price: 15.00 },
    { size: '60ml', price: 25.00 },
    { size: '100ml', price: 35.00 },
    { size: 'Eco-pack refill', price: 20.00 }
  ];

  // Fetch user allergens from previous quiz
  useEffect(() => {
    const fetchUserAllergens = async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_responses')
          .select('allergies')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          setAllergens(data.allergies || []);
        }
      } catch (error) {
        console.log('No previous quiz data found');
      }
    };

    fetchUserAllergens();
  }, []);

  // Calculate total price
  useEffect(() => {
    let price = 0;
    
    // Base bottle price
    const bottlePrice = bottleSizes.find(b => b.size === bottleSize)?.price || 0;
    price += bottlePrice;

    // Base oils price
    const bottleVolume = bottleSize === 'Eco-pack refill' ? 100 : parseInt(bottleSize);
    selectedBaseOils.forEach(oil => {
      const oilPrice = baseOilOptions.find(b => b.name === oil.name)?.price_per_ml || 0;
      price += (oil.percentage / 100) * bottleVolume * oilPrice;
    });

    // Boost ingredients price
    boostIngredients.forEach(ingredient => {
      const boost = boostOptions.find(b => b.name === ingredient);
      if (boost) price += boost.price;
    });

    // Scent price
    if (scent === 'Custom scent') price += 10.00;
    else if (scent !== 'Unscented' && scent !== '') price += 5.00;

    setTotalPrice(Math.round(price * 100) / 100);
  }, [selectedBaseOils, boostIngredients, scent, bottleSize]);

  const addBaseOil = (oilName: string) => {
    if (selectedBaseOils.length >= 3) {
      toast({
        title: "Maximum oils reached",
        description: "You can select up to 3 base oils",
        variant: "destructive"
      });
      return;
    }

    const oil = baseOilOptions.find(o => o.name === oilName);
    if (!oil) return;

    // Check allergens
    if (oil.allergens.some(allergen => allergens.includes(allergen))) {
      toast({
        title: "Allergen detected",
        description: `${oilName} contains ingredients you're allergic to`,
        variant: "destructive"
      });
      return;
    }

    const newOil: BaseOil = {
      name: oilName,
      percentage: selectedBaseOils.length === 0 ? 100 : 0,
      benefits: oil.benefits,
      price_per_ml: oil.price_per_ml
    };

    setSelectedBaseOils([...selectedBaseOils, newOil]);
  };

  const removeBaseOil = (index: number) => {
    const newOils = selectedBaseOils.filter((_, i) => i !== index);
    
    // Redistribute percentages
    if (newOils.length > 0) {
      const equalPercentage = Math.floor(100 / newOils.length);
      const remainder = 100 - (equalPercentage * newOils.length);
      
      newOils.forEach((oil, i) => {
        oil.percentage = equalPercentage + (i === 0 ? remainder : 0);
      });
    }
    
    setSelectedBaseOils(newOils);
  };

  const updateOilPercentage = (index: number, percentage: number) => {
    const newOils = [...selectedBaseOils];
    const oldPercentage = newOils[index].percentage;
    newOils[index].percentage = percentage;

    // Adjust other oils to maintain 100%
    const remainingOils = newOils.filter((_, i) => i !== index);
    const remainingPercentage = 100 - percentage;
    
    if (remainingOils.length > 0) {
      const adjustmentFactor = remainingPercentage / (100 - oldPercentage);
      remainingOils.forEach(oil => {
        oil.percentage = Math.round(oil.percentage * adjustmentFactor);
      });
      
      // Ensure total is exactly 100%
      const currentTotal = newOils.reduce((sum, oil) => sum + oil.percentage, 0);
      if (currentTotal !== 100) {
        newOils[0].percentage += 100 - currentTotal;
      }
    }

    setSelectedBaseOils(newOils);
  };

  const toggleBoostIngredient = (ingredient: string) => {
    const boost = boostOptions.find(b => b.name === ingredient);
    if (boost?.allergens?.some(allergen => allergens.includes(allergen))) {
      toast({
        title: "Allergen detected",
        description: `${ingredient} contains ingredients you're allergic to`,
        variant: "destructive"
      });
      return;
    }

    setBoostIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const generateBenefits = () => {
    const benefits = new Set<string>();
    
    selectedBaseOils.forEach(oil => {
      oil.benefits.forEach(benefit => benefits.add(benefit));
    });
    
    boostIngredients.forEach(ingredient => {
      const boost = boostOptions.find(b => b.name === ingredient);
      boost?.benefits.forEach(benefit => benefits.add(benefit));
    });

    return Array.from(benefits);
  };

  const saveBlend = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your custom blend.",
        variant: "destructive",
      });
      return;
    }

    try {
      const blendData = {
        blend_name: blendName,
        base_oils: selectedBaseOils.reduce((acc, oil) => {
          acc[oil.name] = oil.percentage;
          return acc;
        }, {} as Record<string, number>),
        boost_ingredients: boostIngredients,
        scent: scent,
        custom_scent: customScent,
        bottle_size: bottleSize,
        total_price: totalPrice,
        user_id: user.id,
        is_saved: true
      };

      const { error } = await supabase
        .from('custom_oil_blends')
        .insert([blendData]);

      if (error) throw error;

      toast({
        title: "Blend saved!",
        description: "Your custom oil blend has been saved to your account"
      });
    } catch (error) {
      console.error('Error saving blend:', error);
      toast({
        title: "Error",
        description: "Failed to save blend. Please try again.",
        variant: "destructive"
      });
    }
  };

  const steps = [
    'Choose Base Oils',
    'Add Boost Ingredients', 
    'Choose Scent',
    'Name Your Blend',
    'Choose Bottle Size',
    'Review & Order'
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return selectedBaseOils.length > 0;
      case 1: return true; // Optional step
      case 2: return true; // Optional step
      case 3: return blendName.trim() !== '';
      case 4: return bottleSize !== '';
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light via-background to-sage-light/50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-heading text-primary-dark">Build Your Custom Oil</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  <span>{steps[currentStep]}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Step 0: Choose Base Oils */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <p className="text-gray-600">Select up to 3 base oils. Adjust percentages with sliders.</p>
                    
                    {/* Selected Oils */}
                    {selectedBaseOils.length > 0 && (
                      <div className="space-y-4 p-4 bg-sage-light/20 rounded-lg">
                        <h3 className="font-semibold text-primary-dark">Your Base Oil Blend</h3>
                        {selectedBaseOils.map((oil, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{oil.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">{oil.percentage}%</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeBaseOil(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Slider
                              value={[oil.percentage]}
                              onValueChange={(value) => updateOilPercentage(index, value[0])}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                            <div className="text-xs text-gray-500">
                              Benefits: {oil.benefits.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Available Oils */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {baseOilOptions
                        .filter(oil => !selectedBaseOils.some(selected => selected.name === oil.name))
                        .filter(oil => !oil.allergens.some(allergen => allergens.includes(allergen)))
                        .map((oil) => (
                        <div key={oil.name} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{oil.name}</h4>
                            <span className="text-sm text-gray-500">${oil.price_per_ml}/ml</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {oil.benefits.join(', ')}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addBaseOil(oil.name)}
                            disabled={selectedBaseOils.length >= 3}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Oil
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 1: Add Boost Ingredients */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <p className="text-gray-600">Optional: Add premium ingredients to enhance your blend.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {boostOptions
                        .filter(boost => !boost.allergens?.some(allergen => allergens.includes(allergen)))
                        .map((boost) => (
                        <div key={boost.name} className="border border-border rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={boost.name}
                              checked={boostIngredients.includes(boost.name)}
                              onCheckedChange={() => toggleBoostIngredient(boost.name)}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <Label htmlFor={boost.name} className="font-semibold text-gray-900">
                                  {boost.name}
                                </Label>
                                <span className="text-sm text-gray-500">+${boost.price}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {boost.benefits.join(', ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Choose Scent */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <p className="text-gray-600">Optional: Add a natural scent to your oil blend.</p>
                    
                    <RadioGroup value={scent} onValueChange={setScent} className="space-y-3">
                      {scentOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="text-sm">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {scent === 'Custom scent' && (
                      <div>
                        <Label htmlFor="custom-scent" className="text-sm font-medium">
                          Describe your desired scent
                        </Label>
                        <Input
                          id="custom-scent"
                          value={customScent}
                          onChange={(e) => setCustomScent(e.target.value)}
                          placeholder="e.g., Fresh citrus with hints of mint"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Name Your Blend */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <p className="text-gray-600">Give your custom blend a unique name.</p>
                    
                    <div>
                      <Label htmlFor="blend-name" className="text-sm font-medium">
                        Blend Name
                      </Label>
                      <Input
                        id="blend-name"
                        value={blendName}
                        onChange={(e) => setBlendName(e.target.value)}
                        placeholder="e.g., My Perfect Glow Oil"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Choose Bottle Size */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <p className="text-gray-600">Select your preferred bottle size.</p>
                    
                    <RadioGroup value={bottleSize} onValueChange={setBottleSize} className="space-y-3">
                      {bottleSizes.map((bottle) => (
                        <div key={bottle.size} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={bottle.size} id={bottle.size} />
                            <Label htmlFor={bottle.size} className="text-sm font-medium">{bottle.size}</Label>
                          </div>
                          <span className="text-sm text-gray-600">${bottle.price}</span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Step 5: Review & Order */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-primary-dark">Review Your Custom Blend</h3>
                    
                    <div className="bg-sage-light/20 rounded-lg p-6 space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{blendName}</h4>
                        <p className="text-sm text-gray-600">{bottleSize} bottle</p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Base Oils:</h5>
                        {selectedBaseOils.map((oil, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {oil.name}: {oil.percentage}%
                          </div>
                        ))}
                      </div>

                      {boostIngredients.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Boost Ingredients:</h5>
                          <div className="text-sm text-gray-600">
                            {boostIngredients.join(', ')}
                          </div>
                        </div>
                      )}

                      {scent && scent !== 'Unscented' && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Scent:</h5>
                          <div className="text-sm text-gray-600">
                            {scent === 'Custom scent' ? customScent : scent}
                          </div>
                        </div>
                      )}

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Benefits:</h5>
                        <div className="text-sm text-gray-600">
                          {generateBenefits().join(', ')}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total Price:</span>
                          <span className="text-2xl font-bold text-primary">${totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button onClick={saveBlend} variant="outline" className="flex-1">
                        Save My Blend
                      </Button>
                      <Button asChild className="flex-1 bg-gradient-to-r from-primary to-success text-primary-foreground hover:opacity-90 transition-opacity">
                        <Link to="/cart">
                          Add to Cart
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>

                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid() || currentStep === steps.length - 1}
                    className="flex items-center space-x-2 bg-gradient-primary text-white"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Your Blend Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Blend Name:</h4>
                  <p className="text-sm text-gray-600">{blendName || 'Not named yet'}</p>
                </div>

                {selectedBaseOils.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Base Oils:</h4>
                    {selectedBaseOils.map((oil, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {oil.name}: {oil.percentage}%
                      </div>
                    ))}
                  </div>
                )}

                {boostIngredients.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Boosts:</h4>
                    <div className="text-sm text-gray-600">
                      {boostIngredients.join(', ')}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Bottle Size:</h4>
                  <p className="text-sm text-gray-600">{bottleSize}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-primary">${totalPrice}</span>
                  </div>
                </div>

                {generateBenefits().length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                    <div className="flex flex-wrap gap-1">
                      {generateBenefits().slice(0, 5).map((benefit, index) => (
                        <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildOil;