import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MapPin, Search, Globe } from "lucide-react";

interface LocationData {
  country: string;
  region: string;
  isTurksAndCaicos: boolean;
}

interface LocationSelectorProps {
  onLocationSelect: (location: LocationData) => void;
  onClose: () => void;
  currentLocation: LocationData;
}

const POPULAR_DESTINATIONS = [
  { 
    name: 'Turks and Caicos Islands', 
    region: 'Caribbean',
    isTurksAndCaicos: true 
  },
  { 
    name: 'United States', 
    region: 'North America',
    isTurksAndCaicos: false 
  },
  { 
    name: 'Canada', 
    region: 'North America',
    isTurksAndCaicos: false 
  },
  { 
    name: 'United Kingdom', 
    region: 'Europe',
    isTurksAndCaicos: false 
  },
  { 
    name: 'Bahamas', 
    region: 'Caribbean',
    isTurksAndCaicos: false 
  },
  { 
    name: 'Jamaica', 
    region: 'Caribbean',
    isTurksAndCaicos: false 
  },
  { 
    name: 'Barbados', 
    region: 'Caribbean',
    isTurksAndCaicos: false 
  }
];

const CARIBBEAN_POSTAL_CODES = {
  'TC': 'Turks and Caicos Islands',
  'BS': 'Bahamas', 
  'JM': 'Jamaica',
  'BB': 'Barbados',
  'DO': 'Dominican Republic',
  'CU': 'Cuba',
  'HT': 'Haiti',
  'PR': 'Puerto Rico'
};

export const LocationSelector = ({ onLocationSelect, onClose, currentLocation }: LocationSelectorProps) => {
  const [zipCode, setZipCode] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleZipSearch = async () => {
    if (!zipCode.trim()) return;
    
    setIsSearching(true);
    try {
      // Simple T&C postal code detection
      if (/^TKCA\s?1ZZ$/i.test(zipCode.trim())) {
        onLocationSelect({
          country: 'Turks and Caicos Islands',
          region: 'Caribbean',
          isTurksAndCaicos: true
        });
        return;
      }

      // US ZIP codes (5 digits or 5+4)
      if (/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
        onLocationSelect({
          country: 'United States',
          region: 'North America',
          isTurksAndCaicos: false
        });
        return;
      }

      // Canadian postal codes
      if (/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(zipCode.trim())) {
        onLocationSelect({
          country: 'Canada',
          region: 'North America',
          isTurksAndCaicos: false
        });
        return;
      }

      // UK postal codes (basic pattern)
      if (/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(zipCode.trim())) {
        onLocationSelect({
          country: 'United Kingdom',
          region: 'Europe',
          isTurksAndCaicos: false
        });
        return;
      }

      // Default to international
      onLocationSelect({
        country: 'International',
        region: 'Unknown',
        isTurksAndCaicos: false
      });

    } catch (error) {
      console.error('Zip code lookup failed:', error);
      onLocationSelect({
        country: 'International',
        region: 'Unknown',
        isTurksAndCaicos: false
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCountrySelect = (countryName: string) => {
    const country = POPULAR_DESTINATIONS.find(dest => dest.name === countryName);
    if (country) {
      onLocationSelect({
        country: country.name,
        region: country.region,
        isTurksAndCaicos: country.isTurksAndCaicos
      });
    }
  };

  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Select Your Location
        </CardTitle>
        <CardDescription>
          Choose your location to see accurate shipping options and pricing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Popular Destinations */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Popular Destinations</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {POPULAR_DESTINATIONS.map((destination) => (
              <Button
                key={destination.name}
                variant={currentLocation.country === destination.name ? "default" : "outline"}
                size="sm"
                onClick={() => handleCountrySelect(destination.name)}
                className="justify-start text-left h-auto p-3"
              >
                <div>
                  <div className="font-medium text-sm">{destination.name}</div>
                  <div className="text-xs text-muted-foreground">{destination.region}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* ZIP/Postal Code Search */}
        <div className="space-y-3">
          <Label htmlFor="zipcode" className="text-sm font-medium">
            Enter ZIP/Postal Code
          </Label>
          <div className="flex gap-2">
            <Input
              id="zipcode"
              placeholder="e.g., TKCA 1ZZ, 10001, K1A 0A6, SW1A 1AA"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleZipSearch()}
            />
            <Button
              onClick={handleZipSearch}
              disabled={!zipCode.trim() || isSearching}
              className="shrink-0"
            >
              <Search className="h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            We'll automatically detect your country from your postal code
          </p>
        </div>

        <Separator />

        {/* Manual Country Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Or select manually</Label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tc">🇹🇨 Turks and Caicos Islands</SelectItem>
              <SelectItem value="us">🇺🇸 United States</SelectItem>
              <SelectItem value="ca">🇨🇦 Canada</SelectItem>
              <SelectItem value="gb">🇬🇧 United Kingdom</SelectItem>
              <SelectItem value="bs">🇧🇸 Bahamas</SelectItem>
              <SelectItem value="jm">🇯🇲 Jamaica</SelectItem>
              <SelectItem value="bb">🇧🇧 Barbados</SelectItem>
              <SelectItem value="other">🌍 Other Country</SelectItem>
            </SelectContent>
          </Select>
          {selectedCountry && (
            <Button 
              onClick={() => {
                const countryMap: Record<string, LocationData> = {
                  'tc': { country: 'Turks and Caicos Islands', region: 'Caribbean', isTurksAndCaicos: true },
                  'us': { country: 'United States', region: 'North America', isTurksAndCaicos: false },
                  'ca': { country: 'Canada', region: 'North America', isTurksAndCaicos: false },
                  'gb': { country: 'United Kingdom', region: 'Europe', isTurksAndCaicos: false },
                  'bs': { country: 'Bahamas', region: 'Caribbean', isTurksAndCaicos: false },
                  'jm': { country: 'Jamaica', region: 'Caribbean', isTurksAndCaicos: false },
                  'bb': { country: 'Barbados', region: 'Caribbean', isTurksAndCaicos: false },
                  'other': { country: 'International', region: 'Unknown', isTurksAndCaicos: false }
                };
                onLocationSelect(countryMap[selectedCountry]);
              }}
              className="w-full"
            >
              <Globe className="mr-2 h-4 w-4" />
              Confirm Location
            </Button>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};