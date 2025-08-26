import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, X, Check, Edit } from "lucide-react";
import { LocationSelector } from "./LocationSelector";

interface LocationData {
  country: string;
  region: string;
  isTurksAndCaicos: boolean;
}

interface LocationConfirmationBarProps {
  detectedLocation: LocationData;
  isLoading: boolean;
  onLocationConfirm: (location: LocationData) => void;
  onLocationChange: (location: LocationData) => void;
  isVisible: boolean;
  onDismiss: () => void;
}

export const LocationConfirmationBar = ({
  detectedLocation,
  isLoading,
  onLocationConfirm,
  onLocationChange,
  isVisible,
  onDismiss
}: LocationConfirmationBarProps) => {
  const [showSelector, setShowSelector] = useState(false);

  if (!isVisible || showSelector) {
    return showSelector ? (
      <LocationSelector
        onLocationSelect={(location) => {
          onLocationChange(location);
          setShowSelector(false);
        }}
        onClose={() => setShowSelector(false)}
        currentLocation={detectedLocation}
      />
    ) : null;
  }

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {isLoading ? 'Detecting your location...' : 'We detected you\'re in:'}
                </span>
                {!isLoading && (
                  <Badge variant={detectedLocation.isTurksAndCaicos ? "default" : "outline"}>
                    {detectedLocation.country}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                This helps us show you the right shipping options and pricing
              </p>
            </div>
          </div>

          {!isLoading && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSelector(true)}
                className="flex items-center gap-1"
              >
                <Edit className="h-3 w-3" />
                Change
              </Button>
              <Button
                size="sm"
                onClick={() => onLocationConfirm(detectedLocation)}
                className="flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Correct
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};