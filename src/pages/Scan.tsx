import React, { useState, useEffect } from "react";
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
import { STORAGE_KEYS, getStorageItem, setStorageItem } from "@/lib/storage";
import type { ScanHistoryItem } from "@/lib/contracts/scan";
import { Loader2, ClipboardPaste, Search, Barcode, Sparkles, Beaker, History, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { SampleScanModal, SampleItem } from "@/components/scan/SampleScanModal";
import { BarcodeScannerModal } from "@/components/scan/BarcodeScannerModal";

interface ProductSearchResult {
  id: string;
  name: string;
  category: string;
  ingredients: string[] | null;
}

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
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  
  // Product search state
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductSearchResult | null>(null);

  // Product search with debounce
  useEffect(() => {
    if (activeTab !== "product" || productSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, category, ingredients")
          .ilike("name", `%${productSearch}%`)
          .eq("is_active", true)
          .limit(5);

        if (!error && data) {
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [productSearch, activeTab]);

  const handleSelectProduct = (product: ProductSearchResult) => {
    setSelectedProduct(product);
    if (product.ingredients && product.ingredients.length > 0) {
      setIngredientsText(product.ingredients.join(", "));
    }
    setSearchResults([]);
    setProductSearch(product.name);
    toast({
      title: "Product selected",
      description: `${product.name} ingredients loaded`,
    });
  };

  const handleAnalyze = async () => {
    let inputType: "paste" | "product" | "barcode" = "paste";
    let payload: Record<string, unknown> = {};

    if (activeTab === "paste" || (activeTab === "product" && selectedProduct)) {
      if (!ingredientsText.trim()) {
        toast({ title: "Please enter ingredients", variant: "destructive" });
        return;
      }
      inputType = selectedProduct ? "product" : "paste";
      payload = { 
        ingredientsText: ingredientsText.trim(),
        ...(selectedProduct && { productId: selectedProduct.id })
      };
    } else if (activeTab === "barcode") {
      if (!barcode.trim()) {
        toast({ title: "Please enter a barcode", variant: "destructive" });
        return;
      }
      inputType = "barcode";
      payload = { barcode: barcode.trim() };
    } else if (activeTab === "product") {
      if (!productSearch.trim()) {
        toast({ title: "Please search for a product or paste ingredients", variant: "destructive" });
        return;
      }
      // If no product selected, treat as paste
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

      // Save to localStorage history
      const history = getStorageItem<ScanHistoryItem[]>(STORAGE_KEYS.SCAN_HISTORY) || [];
      history.unshift({ scanId: data.scanId, createdAt: new Date().toISOString() });
      setStorageItem(STORAGE_KEYS.SCAN_HISTORY, history.slice(0, 5));

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
    setSelectedProduct(null);
    setSearchResults([]);
  };

  const handleSelectSample = (sample: SampleItem) => {
    setIngredientsText(sample.ingredients);
    setActiveTab("paste");
    setSelectedProduct(null);
    toast({
      title: "Sample loaded",
      description: `"${sample.name}" ingredients ready to analyze`,
    });
  };

  const handleBarcodeScanned = (scannedBarcode: string) => {
    setBarcode(scannedBarcode);
    setActiveTab("barcode");
    toast({
      title: "Barcode captured",
      description: `Barcode ${scannedBarcode} ready to analyze`,
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
            Paste ingredients, search our database, or scan a barcode to identify potential skin irritants.
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
                    Search Product Database
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Search products by name..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setSelectedProduct(null);
                      }}
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 border rounded-lg overflow-hidden bg-background shadow-lg">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors border-b last:border-b-0"
                        >
                          <div className="font-medium text-sm text-foreground">{product.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                            {product.ingredients && (
                              <span className="text-xs text-muted-foreground">
                                {product.ingredients.length} ingredients
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedProduct && (
                    <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{selectedProduct.name}</p>
                          <p className="text-xs text-muted-foreground">Ingredients loaded</p>
                        </div>
                        <Badge variant="secondary">Selected</Badge>
                      </div>
                    </div>
                  )}

                  {!selectedProduct && productSearch.length >= 2 && searchResults.length === 0 && !isSearching && (
                    <p className="text-xs text-muted-foreground mt-2">
                      No products found. Try pasting ingredients directly instead.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="barcode" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Enter or Scan Barcode
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., 5060462750012"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => setBarcodeModalOpen(true)}
                      className="flex-shrink-0"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Scan
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Use camera to scan or enter barcode manually
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
          <Link to="/skin-profile">
            <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Skin Profile</p>
                  <p className="text-xs text-muted-foreground">Get personalized results</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Modals */}
      <SampleScanModal
        open={sampleModalOpen}
        onOpenChange={setSampleModalOpen}
        onSelectSample={handleSelectSample}
      />
      <BarcodeScannerModal
        open={barcodeModalOpen}
        onOpenChange={setBarcodeModalOpen}
        onBarcodeScanned={handleBarcodeScanned}
      />
    </div>
  );
}
