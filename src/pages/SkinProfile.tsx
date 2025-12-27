import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSkinProfile } from '@/contexts/SkinProfileContext';
import { useAuth } from '@/hooks/useAuth';
import type { SkinProfile, SkinType, SkinFlag } from '@/lib/contracts/profile';
import { 
  User, 
  Sparkles, 
  Check, 
  Save, 
  Trash2,
  AlertCircle,
  Droplets,
  Sun,
  Flower2,
  ShieldCheck
} from 'lucide-react';

const SKIN_TYPE_OPTIONS: { value: SkinType; label: string; description: string }[] = [
  { value: 'oily', label: 'Oily', description: 'Shiny, enlarged pores, prone to breakouts' },
  { value: 'dry', label: 'Dry', description: 'Tight, flaky, may feel rough' },
  { value: 'combination', label: 'Combination', description: 'Oily T-zone, dry cheeks' },
  { value: 'normal', label: 'Normal', description: 'Balanced, minimal concerns' },
  { value: 'sensitive', label: 'Sensitive', description: 'Easily irritated, reactive' },
];

const SKIN_FLAGS: { value: SkinFlag; label: string; icon: React.ReactNode }[] = [
  { value: 'fragrance_sensitive', label: 'Fragrance Sensitive', icon: <Flower2 className="w-4 h-4" /> },
  { value: 'acne_prone', label: 'Acne Prone', icon: <AlertCircle className="w-4 h-4" /> },
  { value: 'eczema_prone', label: 'Eczema Prone', icon: <ShieldCheck className="w-4 h-4" /> },
  { value: 'hyperpigmentation_concern', label: 'Hyperpigmentation', icon: <Sun className="w-4 h-4" /> },
  { value: 'allergy_prone', label: 'Allergy Prone', icon: <AlertCircle className="w-4 h-4" /> },
  { value: 'rosacea_prone', label: 'Rosacea Prone', icon: <Droplets className="w-4 h-4" /> },
  { value: 'aging_concern', label: 'Aging Concerns', icon: <Sparkles className="w-4 h-4" /> },
  { value: 'dehydration_prone', label: 'Dehydration Prone', icon: <Droplets className="w-4 h-4" /> },
  { value: 'sun_sensitive', label: 'Sun Sensitive', icon: <Sun className="w-4 h-4" /> },
];

export default function SkinProfile() {
  const { profile, updateProfile, clearProfile, hasProfile, isLoading } = useSkinProfile();
  const { user } = useAuth();
  const { toast } = useToast();

  const [skinType, setSkinType] = useState<SkinType>(profile?.skinType || 'normal');
  const [flags, setFlags] = useState<SkinFlag[]>(profile?.flags || []);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when profile loads
  React.useEffect(() => {
    if (profile) {
      setSkinType(profile.skinType);
      setFlags(profile.flags);
    }
  }, [profile]);

  const toggleFlag = (flag: SkinFlag) => {
    setFlags(prev => 
      prev.includes(flag) 
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newProfile: SkinProfile = {
        skinType,
        flags,
        updatedAt: new Date().toISOString(),
      };
      await updateProfile(newProfile);
      toast({
        title: 'Profile saved',
        description: user ? 'Your skin profile has been saved to your account.' : 'Your skin profile has been saved locally.',
      });
    } catch (error) {
      toast({
        title: 'Failed to save',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    await clearProfile();
    setSkinType('normal');
    setFlags([]);
    toast({
      title: 'Profile cleared',
      description: 'Your skin profile has been reset.',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-herb-sage/20 via-background to-herb-cream/20 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">Skin Profile</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Skin Profile
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Tell us about your skin to get personalized scan results and product recommendations.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Storage indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          {user ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span>Synced to your account</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Saved locally. <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to sync across devices.</span>
            </>
          )}
        </div>

        {/* Skin Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What's your skin type?</CardTitle>
            <CardDescription>Select the option that best describes your skin</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={skinType}
              onValueChange={(value) => setSkinType(value as SkinType)}
              className="grid gap-3"
            >
              {SKIN_TYPE_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                    skinType === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSkinType(option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Skin Concerns/Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Do any of these apply to you?</CardTitle>
            <CardDescription>Select all that apply for personalized results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SKIN_FLAGS.map((flag) => (
                <div
                  key={flag.value}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                    flags.includes(flag.value)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleFlag(flag.value)}
                >
                  <Checkbox
                    id={flag.value}
                    checked={flags.includes(flag.value)}
                    onCheckedChange={() => toggleFlag(flag.value)}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{flag.icon}</span>
                    <Label htmlFor={flag.value} className="cursor-pointer text-sm">
                      {flag.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Profile Summary */}
        {(skinType || flags.length > 0) && (
          <Card className="bg-secondary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Your Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="capitalize">
                  {skinType} Skin
                </Badge>
                {flags.map((flag) => (
                  <Badge key={flag} variant="outline" className="text-xs">
                    {SKIN_FLAGS.find(f => f.value === flag)?.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
          {hasProfile && (
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Profile
            </Button>
          )}
        </div>

        {/* Quick Links */}
        <div className="pt-6 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Next Steps</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/scan">
              <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Scan Products</p>
                    <p className="text-xs text-muted-foreground">Get personalized results</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link to="/build-oil">
              <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Build Oil</p>
                    <p className="text-xs text-muted-foreground">Custom blend for you</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
