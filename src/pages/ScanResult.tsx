import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
} from "lucide-react";
import ReportIssueModal from "@/components/scan/ReportIssueModal";

interface MatchedIngredient {
  name: string;
  slug: string;
  categories: string[];
  severity: number;
  notes: string;
  matchedTerm: string;
}

interface FlagData {
  key: string;
  label: string;
  severity: number;
  matched: string[];
}

interface ScanResultData {
  riskScore: number;
  riskTier: "low" | "moderate" | "high";
  flags: FlagData[];
  summary: string[];
  matchedIngredients: MatchedIngredient[];
  disclaimer: string;
}

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
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

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

        setResult(data.result_json as unknown as ScanResultData);
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
  }, [scanId, toast]);

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
            <span className="text-4xl font-bold text-foreground">{result.riskScore}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
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
