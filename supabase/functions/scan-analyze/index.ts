import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyzeRequest {
  inputType: "paste" | "product" | "barcode";
  ingredientsText?: string;
  productId?: string;
  barcode?: string;
  userId?: string;
}

interface MatchedIngredient {
  name: string;
  slug: string;
  categories: string[];
  severity: number;
  notes: string;
  matchedTerm: string;
}

interface Flag {
  key: string;
  label: string;
  severity: number;
  matched: string[];
}

interface AnalysisResult {
  scanId: string;
  riskScore: number;
  riskTier: "low" | "moderate" | "high";
  flags: Flag[];
  summary: string[];
  matchedIngredients: MatchedIngredient[];
  disclaimer: string;
}

// Category display labels
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

// Summary messages based on categories
const categorySummaries: Record<string, string> = {
  irritant: "May cause irritation for sensitive skin",
  allergen: "Contains potential allergens that may trigger reactions",
  barrier_disruptor: "May compromise skin barrier function",
  acne_trigger: "May worsen acne for acne-prone individuals",
  comedogenic: "May clog pores and cause breakouts",
  sensitizer: "May cause sensitization with repeated exposure",
  photosensitivity: "May increase sun sensitivity - use sunscreen",
  inflammation: "May promote inflammation in the body",
  glycation: "May accelerate skin aging through glycation",
  dairy: "Dairy-derived ingredients may trigger hormonal acne",
};

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, "");
}

function parseIngredients(text: string): string[] {
  // Split by common delimiters: comma, newline, semicolon
  return text
    .split(/[,;\n]+/)
    .map((i) => i.trim())
    .filter((i) => i.length > 0);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: AnalyzeRequest = await req.json();
    console.log("Analyze request:", body);

    let ingredientsText = body.ingredientsText || "";
    let productId = body.productId || null;

    // If barcode or productId provided, look up the product
    if (body.inputType === "barcode" && body.barcode) {
      const { data: product } = await supabase
        .from("products")
        .select("id, ingredients_text")
        .eq("barcode", body.barcode)
        .single();

      if (product) {
        productId = product.id;
        ingredientsText = product.ingredients_text || ingredientsText;
      }
    } else if (body.inputType === "product" && body.productId) {
      const { data: product } = await supabase
        .from("products")
        .select("id, ingredients_text")
        .eq("id", body.productId)
        .single();

      if (product) {
        productId = product.id;
        ingredientsText = product.ingredients_text || ingredientsText;
      }
    }

    // Parse ingredients from text
    const parsedIngredients = parseIngredients(ingredientsText);
    const normalizedParsed = parsedIngredients.map(normalizeText);

    console.log("Parsed ingredients:", parsedIngredients.length);

    // Fetch all trigger ingredients from database
    const { data: triggerIngredients, error: dbError } = await supabase
      .from("trigger_ingredients")
      .select("*");

    if (dbError) {
      console.error("DB error:", dbError);
      throw new Error("Failed to fetch trigger ingredients");
    }

    // Match ingredients
    const matchedIngredients: MatchedIngredient[] = [];
    const seenSlugs = new Set<string>();

    for (const parsed of parsedIngredients) {
      const normalizedParsed = normalizeText(parsed);

      for (const trigger of triggerIngredients || []) {
        if (seenSlugs.has(trigger.slug)) continue;

        const normalizedName = normalizeText(trigger.name);
        const normalizedAliases = (trigger.aliases || []).map(normalizeText);

        // Check if parsed ingredient matches name or any alias
        const matches =
          normalizedParsed.includes(normalizedName) ||
          normalizedName.includes(normalizedParsed) ||
          normalizedAliases.some(
            (alias) =>
              normalizedParsed.includes(alias) || alias.includes(normalizedParsed)
          );

        if (matches) {
          seenSlugs.add(trigger.slug);
          matchedIngredients.push({
            name: trigger.name,
            slug: trigger.slug,
            categories: trigger.categories || [],
            severity: trigger.severity,
            notes: trigger.notes || "",
            matchedTerm: parsed,
          });
        }
      }
    }

    console.log("Matched ingredients:", matchedIngredients.length);

    // Build flags from matched categories
    const flagMap = new Map<string, { severity: number; matched: string[] }>();

    for (const ingredient of matchedIngredients) {
      for (const category of ingredient.categories) {
        if (!flagMap.has(category)) {
          flagMap.set(category, { severity: 0, matched: [] });
        }
        const flag = flagMap.get(category)!;
        flag.matched.push(ingredient.name);
        flag.severity = Math.max(flag.severity, ingredient.severity);
      }
    }

    const flags: Flag[] = Array.from(flagMap.entries()).map(([key, data]) => ({
      key,
      label: categoryLabels[key] || key,
      severity: data.severity,
      matched: [...new Set(data.matched)],
    }));

    // Sort flags by severity descending
    flags.sort((a, b) => b.severity - a.severity);

    // Calculate risk score (0-100)
    let riskScore = 0;

    // Base score from number of matches weighted by severity
    for (const ingredient of matchedIngredients) {
      riskScore += ingredient.severity * 10;
    }

    // Additional score from high-severity categories
    for (const flag of flags) {
      if (flag.severity === 3) riskScore += 15;
      else if (flag.severity === 2) riskScore += 8;
      else riskScore += 3;
    }

    // Cap at 100
    riskScore = Math.min(100, riskScore);

    // Determine risk tier
    let riskTier: "low" | "moderate" | "high";
    if (riskScore >= 60) {
      riskTier = "high";
    } else if (riskScore >= 30) {
      riskTier = "moderate";
    } else {
      riskTier = "low";
    }

    // Build summary
    const summarySet = new Set<string>();
    for (const flag of flags) {
      if (categorySummaries[flag.key]) {
        summarySet.add(categorySummaries[flag.key]);
      }
    }

    const summary =
      summarySet.size > 0
        ? Array.from(summarySet)
        : ["No known triggers detected based on available database"];

    // Build result
    const result: Omit<AnalysisResult, "scanId"> = {
      riskScore,
      riskTier,
      flags,
      summary,
      matchedIngredients: matchedIngredients.map((m) => ({
        name: m.name,
        slug: m.slug,
        categories: m.categories,
        severity: m.severity,
        notes: m.notes,
        matchedTerm: m.matchedTerm,
      })),
      disclaimer: "Educational only. Not medical advice. Consult a dermatologist for personalized guidance.",
    };

    // Store scan event
    const { data: scanEvent, error: scanError } = await supabase
      .from("scan_events")
      .insert({
        user_id: body.userId || null,
        input_type: body.inputType,
        product_id: productId,
        barcode: body.barcode || null,
        raw_ingredients_text: ingredientsText,
        result_json: result,
      })
      .select("id")
      .single();

    if (scanError) {
      console.error("Scan insert error:", scanError);
      throw new Error("Failed to save scan event");
    }

    const finalResult: AnalysisResult = {
      scanId: scanEvent.id,
      ...result,
    };

    console.log("Analysis complete, scanId:", scanEvent.id);

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Analyze error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
