import { useState, useEffect } from 'react';

export interface LocationInfo {
  country: string;
  region: string;
  isTurksAndCaicos: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useLocationDetection = () => {
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    country: '',
    region: '',
    isTurksAndCaicos: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try multiple IP geolocation services for better reliability
        let response;
        
        try {
          // Primary service - ipapi.co
          response = await fetch('https://ipapi.co/json/');
          if (!response.ok) throw new Error('Primary service failed');
        } catch {
          try {
            // Fallback service - ipgeolocation.io (free tier)
            response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=free');
            if (!response.ok) throw new Error('Fallback service failed');
          } catch {
            // Final fallback - detect from timezone or use default
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const isTCTimezone = timezone === 'America/Grand_Turk' || timezone === 'America/Nassau';
            
            setLocationInfo({
              country: isTCTimezone ? 'Turks and Caicos' : 'International',
              region: isTCTimezone ? 'Caribbean' : 'Unknown',
              isTurksAndCaicos: isTCTimezone,
              isLoading: false,
              error: null
            });
            return;
          }
        }

        const data = await response.json();
        
        // Handle different API response formats
        const country = data.country_name || data.country || 'International';
        const region = data.region || data.continent_name || 'Unknown';
        
        // Check if user is in Turks and Caicos
        const isTurksAndCaicos = 
          country.toLowerCase().includes('turks') ||
          country.toLowerCase().includes('caicos') ||
          data.country_code === 'TC' ||
          data.country_code2 === 'TC';

        setLocationInfo({
          country,
          region,
          isTurksAndCaicos,
          isLoading: false,
          error: null
        });

      } catch (error) {
        console.error('Location detection failed:', error);
        
        // Fallback: assume international user
        setLocationInfo({
          country: 'International',
          region: 'Unknown',
          isTurksAndCaicos: false,
          isLoading: false,
          error: 'Could not detect location'
        });
      }
    };

    detectLocation();
  }, []);

  return locationInfo;
};