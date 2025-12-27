import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ClipboardPaste, Search, Barcode, Sparkles, Beaker, History } from "lucide-react";
import { Link } from "react-router-dom";
import { SampleScanModal, SampleItem } from "@/components/scan/SampleScanModal";

export default function Scan() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("paste");
  const [ingredientsText, setIngredientsText] = useState("");
  const [barcode, setBarcode] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  const handleAnalyze = async () => {
    let inputType: "paste" | "product" | "barcode" = "paste";
    let payload: Record<string, unknown> = {};

    if (activeTab === "paste") {
      if (!ingredientsText.trim()) {
        toast({ title: "Please enter ingredients", variant: "destructive" });
        return;
      }
      inputType = "paste";
      payload = { ingredientsText: ingredientsText.trim() };
    } else if (activeTab === "barcode") {
      if (!barcode.trim()) {
        toast({ title: "Please enter a barcode", variant: "destructive" });
        return;
      }
      inputType = "barcode";
      payload = { barcode: barcode.trim() };
    } else if (activeTab === "product") {
      if (!productSearch.trim()) {
        toast({ title: "Please enter a product name or ingredients", variant: "destructive" });
        return;
      }
      inputType = "paste";
      payload = { ingredientsText: productSearch.trim() };
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("scan-analyze", {
        body: {
          inputType,
          ...payload,
          userId: user?.id || null,
        },
      });

      if (error) throw error;

      const history = JSON.parse(localStorage.getItem("scanHistory") || "[]");
      history.unshift({ scanId: data.scanId, createdAt: new Date().toISOString() });
      localStorage.setItem("scanHistory", JSON.stringify(history.slice(0, 5)));

      navigate(`/scan/result/${data.scanId}`);
    } catch (err) {
      console.error("Scan error:", err);
      toast({
        title: "Analysis failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setIngredientsText("");
    setBarcode("");
    setProductSearch("");
  };

  const handleSelectSample = (sample: SampleItem) => {
    setIngredientsText(sample.ingredients);
    setActiveTab("paste");
    toast({
      title: "Sample loaded",
      description: `"${sample.name}" ingredients ready to analyze`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-herb-sage/20 via-background to-herb-cream/20 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Skin Intelligence Scanner</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Analyze Ingredients for Skin Triggers
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Paste ingredients, enter a barcode, or search products to identify potential skin irritants and triggers.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Choose Input Method</span>
              <Link to="/scan-history">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <History className="w-4 h-4 mr-1" />
                  History
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="paste" className="flex items-center gap-2">
                  <ClipboardPaste className="w-4 h-4" />
                  <span className="hidden sm:inline">Paste</span>
                </TabsTrigger>
                <TabsTrigger value="product" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </TabsTrigger>
                <TabsTrigger value="barcode" className="flex items-center gap-2">
                  <Barcode className="w-4 h-4" />
                  <span className="hidden sm:inline">Barcode</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="paste" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Paste Ingredients List
                  </label>
                  <Textarea
                    placeholder="Water, Glycerin, Sodium Lauryl Sulfate, Fragrance..."
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Copy the ingredients list from any product label or website
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="product" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Search Product
                  </label>
                  <Input
                    placeholder="Enter product name or paste ingredients..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Product database coming soon. For now, paste ingredients directly.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="barcode" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Enter Barcode
                  </label>
                  <Input
                    placeholder="e.g., 5060462750012"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Camera scanning coming soon. Enter the barcode manually for now.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                Clear
              </Button>
            </div>

            {/* Sample */}
            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Beaker className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Try a sample</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Not sure what to scan? Load a sample ingredients list to see how it works.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setSampleModalOpen(true)}
                    className="px-0 h-auto mt-1 text-primary"
                  >
                    Load sample ingredients →
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link to="/ingredients">
            <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Browse Ingredients</p>
                  <p className="text-xs text-muted-foreground">Explore our database</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link to="/quiz">
            <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Take Skin Quiz</p>
                  <p className="text-xs text-muted-foreground">Get personalized tips</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Sample Modal */}
      <SampleScanModal
        open={sampleModalOpen}
        onOpenChange={setSampleModalOpen}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
}
