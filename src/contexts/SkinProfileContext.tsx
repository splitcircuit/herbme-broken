// SkinProfile Context
// Manages skin profile state for guest (localStorage) and authenticated users (Supabase)

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '@/lib/storage';
import { validateProfile } from '@/lib/rules/profileNormalizer';
import type { SkinProfile } from '@/lib/contracts/profile';

interface SkinProfileContextType {
  profile: SkinProfile | null;
  isLoading: boolean;
  hasProfile: boolean;
  updateProfile: (profile: SkinProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
  syncGuestProfileToAccount: () => Promise<boolean>;
  hasGuestProfile: () => boolean;
  getGuestProfile: () => SkinProfile | null;
}

const SkinProfileContext = createContext<SkinProfileContextType | undefined>(undefined);

export const useSkinProfile = () => {
  const context = useContext(SkinProfileContext);
  if (!context) {
    throw new Error('useSkinProfile must be used within a SkinProfileProvider');
  }
  return context;
};

interface SkinProfileProviderProps {
  children: ReactNode;
}

export const SkinProfileProvider = ({ children }: SkinProfileProviderProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile on mount and auth changes
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      
      if (user) {
        // Load from Supabase for authenticated users
        try {
          const { data, error } = await supabase
            .from('skin_profiles')
            .select('skin_type, flags, updated_at')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!error && data) {
            setProfile({
              skinType: (data.skin_type as SkinProfile['skinType']) || 'normal',
              flags: (data.flags as SkinProfile['flags']) || [],
              updatedAt: data.updated_at,
            });
          } else {
            // No DB profile, check localStorage for guest profile
            const guestProfile = getGuestProfile();
            setProfile(guestProfile);
          }
        } catch (err) {
          console.error('Failed to load profile:', err);
          setProfile(null);
        }
      } else {
        // Load from localStorage for guests
        const guestProfile = getGuestProfile();
        setProfile(guestProfile);
      }
      
      setIsLoading(false);
    };

    loadProfile();
  }, [user]);

  // Get guest profile from localStorage
  const getGuestProfile = useCallback((): SkinProfile | null => {
    const raw = getStorageItem<unknown>(STORAGE_KEYS.SKIN_PROFILE);
    return validateProfile(raw);
  }, []);

  // Check if guest profile exists
  const hasGuestProfile = useCallback((): boolean => {
    return getGuestProfile() !== null;
  }, [getGuestProfile]);

  // Update profile (saves to DB if logged in, localStorage if guest)
  const updateProfile = useCallback(async (newProfile: SkinProfile): Promise<void> => {
    const profileWithTimestamp = {
      ...newProfile,
      updatedAt: new Date().toISOString(),
    };

    if (user) {
      // Upsert to Supabase
      const { error } = await supabase
        .from('skin_profiles')
        .upsert({
          user_id: user.id,
          skin_type: profileWithTimestamp.skinType,
          flags: profileWithTimestamp.flags,
          updated_at: profileWithTimestamp.updatedAt,
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Failed to save profile:', error);
        throw new Error('Failed to save profile');
      }
    } else {
      // Save to localStorage for guests
      setStorageItem(STORAGE_KEYS.SKIN_PROFILE, profileWithTimestamp);
    }

    setProfile(profileWithTimestamp);
  }, [user]);

  // Clear profile
  const clearProfile = useCallback(async (): Promise<void> => {
    if (user) {
      await supabase
        .from('skin_profiles')
        .delete()
        .eq('user_id', user.id);
    }
    
    localStorage.removeItem(STORAGE_KEYS.SKIN_PROFILE);
    setProfile(null);
  }, [user]);

  // Sync guest profile to account (called after login)
  const syncGuestProfileToAccount = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    
    const guestProfile = getGuestProfile();
    if (!guestProfile) return false;

    try {
      // Check if DB profile exists and is newer
      const { data: dbProfile } = await supabase
        .from('skin_profiles')
        .select('updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      // If no DB profile or guest is newer, sync
      if (!dbProfile || (guestProfile.updatedAt > dbProfile.updated_at)) {
        await updateProfile(guestProfile);
        // Clear guest profile after successful sync
        localStorage.removeItem(STORAGE_KEYS.SKIN_PROFILE);
        return true;
      }
    } catch (err) {
      console.error('Failed to sync profile:', err);
    }
    
    return false;
  }, [user, getGuestProfile, updateProfile]);

  const value: SkinProfileContextType = {
    profile,
    isLoading,
    hasProfile: profile !== null,
    updateProfile,
    clearProfile,
    syncGuestProfileToAccount,
    hasGuestProfile,
    getGuestProfile,
  };

  return (
    <SkinProfileContext.Provider value={value}>
      {children}
    </SkinProfileContext.Provider>
  );
};
