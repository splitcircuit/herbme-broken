import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSkinProfile } from "@/contexts/SkinProfileContext";
import { getProfileOverlay } from "@/lib/rules/profileRiskOverlay";
import { getRecommendedGoal } from "@/lib/rules/scanFlagToGoals";
import { getGoalLabel } from "@/lib/rules/oilPrefillRules";
import type { ScanResult as ScanResultType } from "@/lib/contracts/scan";
import type { ProfileOverlay } from "@/lib/contracts/profile";
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Share2,
  Flag,
  Scan,
  ChevronRight,
  ExternalLink,
  User,
  Droplets,
  Sparkles,
} from "lucide-react";
import ReportIssueModal from "@/components/scan/ReportIssueModal";

const tierConfig = {
  low: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-200 dark:border-green-800",
    label: "Low Risk",
  },
  moderate: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-200 dark:border-amber-800",
    label: "Moderate Risk",
  },
  high: {
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-100 dark:bg-red-900/30",
    border: "border-red-200 dark:border-red-800",
    label: "High Risk",
  },
};

const severityColors: Record<number, string> = {
  1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  2: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  3: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function ScanResult() {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, hasProfile } = useSkinProfile();
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ScanResultType | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [profileOverlay, setProfileOverlay] = useState<ProfileOverlay | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!scanId) return;

      try {
        const { data, error } = await supabase
          .from("scan_events")
          .select("result_json")
          .eq("id", scanId)
          .single();

        if (error) throw error;

        const scanResult = data.result_json as unknown as ScanResultType;
        setResult(scanResult);

        // Calculate profile overlay if profile exists
        if (profile && scanResult) {
          const overlay = getProfileOverlay(scanResult, profile);
          setProfileOverlay(overlay);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast({
          title: "Failed to load result",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [scanId, toast, profile]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Scan Result", url });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied to clipboard" });
    }
  };

  const handleBuildSupportiveBlend = () => {
    if (!result || !scanId) return;
    
    const goalRec = getRecommendedGoal(result, profile || undefined);
    const goal = goalRec?.goal || 'calm';
    
    navigate(`/build-oil?mode=support&scanId=${scanId}&goal=${goal}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Result not found</h2>
        <p className="text-muted-foreground mb-4">This scan may have expired or doesn't exist.</p>
        <Link to="/scan">
          <Button>Scan Again</Button>
        </Link>
      </div>
    );
  }

  const tier = tierConfig[result.riskTier];
  const TierIcon = tier.icon;
  const displayRiskScore = profileOverlay?.adjustedRiskScore ?? result.riskScore;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className={`${tier.bg} py-8 px-4 border-b ${tier.border}`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 ${tier.color} mb-4`}>
            <TierIcon className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            {tier.label}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-bold text-foreground">{displayRiskScore}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
          {profileOverlay?.adjustedRiskScore && profileOverlay.adjustedRiskScore > result.riskScore && (
            <p className="text-sm text-muted-foreground mt-2">
              Adjusted for your profile (was {result.riskScore})
            </p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Overlay - For Your Profile Section */}
        {hasProfile && profileOverlay && profileOverlay.personalWarnings.length > 0 && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                For Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {profileOverlay.personalWarnings.map((warning, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{warning}</span>
                  </div>
                ))}
              </div>
              {profileOverlay.recommendedActions.length > 0 && (
                <div className="pt-2 border-t border-primary/20">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Recommended Actions</p>
                  <ul className="space-y-1">
                    {profileOverlay.recommendedActions.slice(0, 2).map((action, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                        <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* No Profile CTA */}
        {!hasProfile && result.riskScore > 20 && (
          <Card className="border-dashed bg-secondary/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">Get personalized insights</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add your Skin Profile to see how these results apply specifically to you.
                  </p>
                  <Link to="/skin-profile">
                    <Button variant="link" size="sm" className="px-0 h-auto mt-1 text-primary">
                      Create Skin Profile →
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Flags */}
        {result.flags.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Flag className="w-5 h-5 text-primary" />
                Detected Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.flags.map((flag) => (
                  <Badge
                    key={flag.key}
                    className={severityColors[flag.severity]}
                    variant="secondary"
                  >
                    {flag.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Build Supportive Blend CTA */}
        {result.flags.length > 0 && (
          <Card className="bg-gradient-to-br from-herb-sage/10 to-herb-cream/10 border-herb-sage/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">Build a supportive blend</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Create a custom oil blend designed to counter these triggers and support your skin.
                  </p>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="mt-3"
                    onClick={handleBuildSupportiveBlend}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Build Supportive Blend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">What This Means for Your Skin</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.summary.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Matched Ingredients */}
        {result.matchedIngredients.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Flagged Ingredients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.matchedIngredients.map((ingredient, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="my-3" />}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/ingredients/${ingredient.slug}`}
                        className="font-medium text-foreground hover:text-primary flex items-center gap-1"
                      >
                        {ingredient.name}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {ingredient.notes}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ingredient.categories.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge className={severityColors[ingredient.severity]} variant="secondary">
                      {ingredient.severity === 3
                        ? "High"
                        : ingredient.severity === 2
                        ? "Medium"
                        : "Low"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="p-4 bg-secondary/50 rounded-lg text-center">
          <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/scan" className="flex-1">
            <Button variant="default" className="w-full">
              <Scan className="w-4 h-4 mr-2" />
              Scan Another Item
            </Button>
          </Link>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" onClick={() => setShowReportModal(true)}>
            <Flag className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
        </div>
      </div>

      <ReportIssueModal
        open={showReportModal}
        onOpenChange={setShowReportModal}
        scanId={scanId || ""}
      />
    </div>
  );
}
