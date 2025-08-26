import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface LocationInfo {
  country: string;
  region: string;
  isTurksAndCaicos: boolean;
  isLoading: boolean;
  error: string | null;
  isConfirmed: boolean;
  showConfirmationBar: boolean;
}

interface LocationContextType extends LocationInfo {
  confirmLocation: (location: Omit<LocationInfo, 'isLoading' | 'error' | 'isConfirmed' | 'showConfirmationBar'>) => void;
  updateLocation: (location: Omit<LocationInfo, 'isLoading' | 'error' | 'isConfirmed' | 'showConfirmationBar'>) => void;
  dismissConfirmationBar: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    country: '',
    region: '',
    isTurksAndCaicos: false,
    isLoading: true,
    error: null,
    isConfirmed: false,
    showConfirmationBar: false
  });

  useEffect(() => {
    const detectLocation = async () => {
      // Check if user has a saved location preference
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          setLocationInfo({
            ...parsed,
            isLoading: false,
            error: null,
            isConfirmed: true,
            showConfirmationBar: false
          });
          return;
        } catch {
          // Invalid saved data, continue with detection
        }
      }

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
              country: isTCTimezone ? 'Turks and Caicos Islands' : 'International',
              region: isTCTimezone ? 'Caribbean' : 'Unknown',
              isTurksAndCaicos: isTCTimezone,
              isLoading: false,
              error: null,
              isConfirmed: false,
              showConfirmationBar: true
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
          error: null,
          isConfirmed: false,
          showConfirmationBar: true
        });

      } catch (error) {
        console.error('Location detection failed:', error);
        
        // Fallback: assume international user
        setLocationInfo({
          country: 'International',
          region: 'Unknown',
          isTurksAndCaicos: false,
          isLoading: false,
          error: 'Could not detect location',
          isConfirmed: false,
          showConfirmationBar: true
        });
      }
    };

    detectLocation();
  }, []);

  const confirmLocation = (location: Omit<LocationInfo, 'isLoading' | 'error' | 'isConfirmed' | 'showConfirmationBar'>) => {
    const updatedLocation = {
      ...location,
      isLoading: false,
      error: null,
      isConfirmed: true,
      showConfirmationBar: false
    };
    
    setLocationInfo(updatedLocation);
    
    // Save to localStorage
    localStorage.setItem('userLocation', JSON.stringify({
      country: location.country,
      region: location.region,
      isTurksAndCaicos: location.isTurksAndCaicos
    }));
  };

  const updateLocation = (location: Omit<LocationInfo, 'isLoading' | 'error' | 'isConfirmed' | 'showConfirmationBar'>) => {
    const updatedLocation = {
      ...location,
      isLoading: false,
      error: null,
      isConfirmed: true,
      showConfirmationBar: false
    };
    
    setLocationInfo(updatedLocation);
    
    // Save to localStorage
    localStorage.setItem('userLocation', JSON.stringify({
      country: location.country,
      region: location.region,
      isTurksAndCaicos: location.isTurksAndCaicos
    }));
  };

  const dismissConfirmationBar = () => {
    setLocationInfo(prev => ({
      ...prev,
      showConfirmationBar: false,
      isConfirmed: true
    }));
  };

  return (
    <LocationContext.Provider 
      value={{
        ...locationInfo,
        confirmLocation,
        updateLocation,
        dismissConfirmationBar
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationDetection = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationDetection must be used within a LocationProvider');
  }
  return context;
};

// Legacy hook for backward compatibility
export const useLocationDetectionLegacy = () => {
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    country: '',
    region: '',
    isTurksAndCaicos: false,
    isLoading: true,
    error: null,
    isConfirmed: false,
    showConfirmationBar: false
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
              country: isTCTimezone ? 'Turks and Caicos Islands' : 'International',
              region: isTCTimezone ? 'Caribbean' : 'Unknown',
              isTurksAndCaicos: isTCTimezone,
              isLoading: false,
              error: null,
              isConfirmed: false,
              showConfirmationBar: false
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
          error: null,
          isConfirmed: false,
          showConfirmationBar: false
        });

      } catch (error) {
        console.error('Location detection failed:', error);
        
        // Fallback: assume international user
        setLocationInfo({
          country: 'International',
          region: 'Unknown',
          isTurksAndCaicos: false,
          isLoading: false,
          error: 'Could not detect location',
          isConfirmed: false,
          showConfirmationBar: false
        });
      }
    };

    detectLocation();
  }, []);

  return locationInfo;
};