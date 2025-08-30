import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface QuizData {
  skincare_goals: string[];
  skin_type: string[];
  combination_areas: string;
  skincare_frequency: string;
  cleansing_feeling: string;
  skin_concerns: string[];
  product_preference: string;
  sun_exposure: string;
  active_ingredients: string[];
  routine_preference: string;
  allergies: string[];
  age_range: string;
  location: string;
  email: string;
}

const Quiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({
    skincare_goals: [],
    skin_type: [],
    combination_areas: '',
    skincare_frequency: '',
    cleansing_feeling: '',
    skin_concerns: [],
    product_preference: '',
    sun_exposure: '',
    active_ingredients: [],
    routine_preference: '',
    allergies: [],
    age_range: '',
    location: '',
    email: ''
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const questions = [
    {
      title: "What are your main skincare goals?",
      type: "multi-select",
      field: "skincare_goals",
      options: [
        "Reduce acne or breakouts",
        "Hydrate dry skin", 
        "Brighten dull skin",
        "Fade dark spots or hyperpigmentation",
        "Anti-aging / firming",
        "Soothe sensitive or irritated skin"
      ]
    },
    {
      title: "What's your skin type?",
      type: "multi-select-with-text",
      field: "skin_type",
      textField: "combination_areas",
      options: ["Oily", "Dry", "Combination", "Normal", "Sensitive", "Not sure"]
    },
    {
      title: "When do you usually do skincare?",
      type: "single-select",
      field: "skincare_frequency",
      options: ["Morning only", "Night only", "Both morning and night", "Occasionally"]
    },
    {
      title: "How does your skin typically feel after cleansing?",
      type: "single-select", 
      field: "cleansing_feeling",
      options: ["Tight and dry", "Smooth and clean", "Still oily", "Irritated or red", "I don't usually cleanse"]
    },
    {
      title: "Do you have any of the following concerns?",
      type: "multi-select",
      field: "skin_concerns",
      options: [
        "Large pores",
        "Fine lines or wrinkles",
        "Blackheads / whiteheads", 
        "Redness or rosacea",
        "Dark under-eyes",
        "Uneven texture",
        "Sun damage"
      ]
    },
    {
      title: "Are you looking for natural or fragrance-free products?",
      type: "single-select",
      field: "product_preference", 
      options: ["Yes, only natural ingredients", "Fragrance-free preferred", "Doesn't matter to me"]
    },
    {
      title: "How often are you in the sun?",
      type: "single-select",
      field: "sun_exposure",
      options: ["Rarely", "A few times a week", "Daily / I work outside", "I use sunscreen regularly", "I don't use sunscreen"]
    },
    {
      title: "Are you currently using any active ingredients or treatments?",
      type: "multi-select",
      field: "active_ingredients",
      options: [
        "Retinol",
        "AHAs/BHAs (e.g., glycolic, salicylic acid)",
        "Vitamin C",
        "Niacinamide", 
        "None / Not sure"
      ]
    },
    {
      title: "How many steps do you prefer in your skincare routine?",
      type: "single-select",
      field: "routine_preference",
      options: ["Simple (1–2 steps)", "Moderate (3–4 steps)", "Full routine (5+ steps)"]
    },
    {
      title: "Do you have any known allergies or sensitivities?",
      type: "multi-select",
      field: "allergies",
      options: [
        "Fragrance",
        "Essential oils (e.g. lavender, peppermint, tea tree)",
        "Nuts (e.g. almond oil, shea butter)",
        "Aloe vera",
        "Coconut",
        "I'm not sure",
        "I don't have any allergies"
      ]
    },
    {
      title: "Optional: What's your age range?",
      type: "single-select",
      field: "age_range",
      options: ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"]
    },
    {
      title: "Contact Information",
      type: "contact",
      field: "email"
    }
  ];

  const handleOptionToggle = (field: keyof QuizData, value: string) => {
    setQuizData(prev => {
      if (Array.isArray(prev[field])) {
        const currentArray = prev[field] as string[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        return { ...prev, [field]: newArray };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  const handleTextChange = (field: keyof QuizData, value: string) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const generateRecommendations = async (quizResponseId: string) => {
    try {
      // Fetch products from database
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // Simple recommendation logic based on quiz responses
      const routine = [];
      
      // Cleanser
      if (quizData.skin_type.includes('Oily') || quizData.skin_concerns.includes('Blackheads / whiteheads')) {
        const cleanser = products?.find(p => p.name === 'Clarifying Clay Cleanser');
        if (cleanser) routine.push({ product: cleanser, step: 'Cleanser', order: 1 });
      } else {
        const cleanser = products?.find(p => p.name === 'Sea Moss Gentle Cleanser');
        if (cleanser) routine.push({ product: cleanser, step: 'Cleanser', order: 1 });
      }

      // Toner
      if (quizData.skincare_goals.includes('Brighten dull skin') || quizData.skincare_goals.includes('Fade dark spots or hyperpigmentation')) {
        const toner = products?.find(p => p.name === 'Turmeric Brightening Toner');
        if (toner) routine.push({ product: toner, step: 'Toner', order: 2 });
      }

      // Treatment
      if (quizData.skincare_goals.includes('Soothe sensitive or irritated skin')) {
        const treatment = products?.find(p => p.name === 'Aloe Recovery Serum');
        if (treatment) routine.push({ product: treatment, step: 'Treatment', order: 3 });
      } else if (quizData.skincare_goals.includes('Brighten dull skin') || quizData.skincare_goals.includes('Anti-aging / firming')) {
        const treatment = products?.find(p => p.name === 'Vitamin C Glow Serum');
        if (treatment) routine.push({ product: treatment, step: 'Treatment', order: 3 });
      }

      // Moisturizer
      const moisturizer = products?.find(p => p.name === 'Sea Moss Daily Moisturizer');
      if (moisturizer) routine.push({ product: moisturizer, step: 'Moisturizer', order: 4 });

      // SPF
      if (quizData.sun_exposure !== 'Rarely') {
        const spf = products?.find(p => p.name === 'Zinc Sun Shield SPF 30');
        if (spf) routine.push({ product: spf, step: 'SPF', order: 5 });
      }

      // Save recommendations to database
      for (const item of routine) {
        await supabase.from('quiz_recommendations').insert({
          quiz_response_id: quizResponseId,
          product_id: item.product.id,
          step_order: item.order,
          step_name: item.step,
          reasoning: `Recommended based on your ${quizData.skincare_goals.join(', ')} goals.`
        });
      }

      setRecommendations(routine);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!user && !quizData.email) {
      toast({
        title: "Email Required",
        description: "Please provide your email to get your quiz results.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Save quiz response with user_id if logged in, otherwise just use email
      const quizDataWithUser = {
        ...quizData,
        user_id: user?.id || null
      };

      const { data: quizResponse, error } = await supabase
        .from('quiz_responses')
        .insert([quizDataWithUser])
        .select()
        .single();

      if (error) throw error;

      // Generate recommendations
      await generateRecommendations(quizResponse.id);

      toast({
        title: "Quiz Complete!",
        description: "Your personalized routine is ready!"
      });

      setCurrentStep(questions.length); // Show results
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    const question = questions[currentStep];
    const fieldValue = quizData[question.field as keyof QuizData];
    
    if (question.type === 'contact') {
      return quizData.email.includes('@');
    }
    
    if (Array.isArray(fieldValue)) {
      return fieldValue.length > 0;
    }
    
    return fieldValue !== '';
  };

  if (currentStep >= questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-light via-background to-sage-light/50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-3xl font-heading text-primary-dark">
                Your Personalized Routine
              </CardTitle>
              <CardDescription className="text-lg">
                Based on your skin goals and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recommendations.map((item, index) => (
                <div key={index} className="border border-border rounded-lg p-6 bg-sage-light/20">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-medium text-sm">
                      {item.order}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-primary-dark">{item.step}</h3>
                      <h4 className="font-medium text-gray-900 mt-1">{item.product.name}</h4>
                      <p className="text-gray-600 mt-2">{item.product.description}</p>
                      <p className="text-primary font-semibold mt-2">${item.product.price}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-6">
                <p className="text-gray-600 mb-4">
                  We've sent your personalized routine to {quizData.email}
                </p>
                <Button size="lg" className="bg-gradient-primary text-white">
                  Shop Your Routine
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light via-background to-sage-light/50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-heading text-primary-dark">Skin Analysis Quiz</h1>
            <span className="text-sm text-gray-500">
              {currentStep + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-xl font-heading text-primary-dark">
              {question.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === 'multi-select' && (
              <div className="space-y-3">
                {question.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={(quizData[question.field as keyof QuizData] as string[])?.includes(option)}
                      onCheckedChange={() => handleOptionToggle(question.field as keyof QuizData, option)}
                    />
                    <Label htmlFor={option} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'multi-select-with-text' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={(quizData[question.field as keyof QuizData] as string[])?.includes(option)}
                        onCheckedChange={() => handleOptionToggle(question.field as keyof QuizData, option)}
                      />
                      <Label htmlFor={option} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
                {(quizData[question.field as keyof QuizData] as string[])?.includes('Combination') && (
                  <div>
                    <Label htmlFor="combination-areas" className="text-sm font-medium">
                      Which areas are oily/dry?
                    </Label>
                    <Textarea
                      id="combination-areas"
                      value={quizData.combination_areas}
                      onChange={(e) => handleTextChange('combination_areas', e.target.value)}
                      placeholder="e.g., T-zone is oily, cheeks are dry"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            )}

            {question.type === 'single-select' && (
              <RadioGroup
                value={quizData[question.field as keyof QuizData] as string}
                onValueChange={(value) => handleTextChange(question.field as keyof QuizData, value)}
                className="space-y-3"
              >
                {question.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="text-sm">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === 'contact' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={quizData.email}
                    onChange={(e) => handleTextChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location (Optional)
                  </Label>
                  <Input
                    id="location"
                    value={quizData.location}
                    onChange={(e) => handleTextChange('location', e.target.value)}
                    placeholder="City, Country"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

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
                disabled={!isStepValid() || isSubmitting}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary to-success text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <span>{currentStep === questions.length - 1 ? 'Get Results' : 'Next'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;