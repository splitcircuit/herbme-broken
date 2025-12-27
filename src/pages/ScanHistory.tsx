import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, History, Scan, AlertCircle, ChevronRight, Trash2 } from "lucide-react";

interface ScanHistoryItem {
  id: string;
  created_at: string;
  input_type: string;
  result_json: {
    riskScore: number;
    riskTier: "low" | "moderate" | "high";
    flags: { label: string }[];
  };
}

const tierColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  moderate: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function ScanHistory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);
  const [guestScans, setGuestScans] = useState<{ scanId: string; createdAt: string }[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("scan_events")
            .select("id, created_at, input_type, result_json")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20);

          if (!error && data) {
            setScans(data as unknown as ScanHistoryItem[]);
          }
        } catch (err) {
          console.error("Fetch error:", err);
        }
      } else {
        // Load guest history from localStorage
        const history = JSON.parse(localStorage.getItem("scanHistory") || "[]");
        setGuestScans(history);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  const clearGuestHistory = () => {
    localStorage.removeItem("scanHistory");
    setGuestScans([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isEmpty = user ? scans.length === 0 : guestScans.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-herb-sage/20 via-background to-herb-cream/20 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <History className="w-4 h-4" />
            <span className="text-sm font-medium">Scan History</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Your Recent Scans
          </h1>
          <p className="text-muted-foreground">
            {user
              ? "View your scan history from any device"
              : "Your recent scans are saved locally (last 5)"}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {isEmpty ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">No scans yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Start scanning products to see your history here
                </p>
                <Link to="/scan">
                  <Button>
                    <Scan className="w-4 h-4 mr-2" />
                    Start Scanning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : user ? (
          <div className="space-y-4">
            {scans.map((scan) => (
              <Link key={scan.id} to={`/scan/result/${scan.id}`}>
                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={tierColors[scan.result_json.riskTier]} variant="secondary">
                          Score: {scan.result_json.riskScore}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(scan.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {scan.result_json.flags.slice(0, 3).map((flag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {flag.label}
                          </Badge>
                        ))}
                        {scan.result_json.flags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{scan.result_json.flags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {guestScans.length} scan{guestScans.length !== 1 ? "s" : ""} saved locally
              </p>
              {guestScans.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearGuestHistory}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            {guestScans.map((scan) => (
              <Link key={scan.scanId} to={`/scan/result/${scan.scanId}`}>
                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Scan from {new Date(scan.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(scan.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}

            <Card className="mt-6 p-4 bg-secondary/50 border-dashed">
              <div className="text-center">
                <p className="text-sm text-foreground font-medium mb-2">
                  Want to save your history forever?
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Sign in to sync scans across devices and never lose your history.
                </p>
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* Back to scan */}
        <div className="mt-8 text-center">
          <Link to="/scan">
            <Button variant="outline">
              <Scan className="w-4 h-4 mr-2" />
              New Scan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
