import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSignupData {
  email: string;
  first_name?: string;
  last_name?: string;
  source?: string;
  tags?: string[];
}

export const useNewsletter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const subscribe = async (data: NewsletterSignupData) => {
    setIsLoading(true);
    
    try {
      // Add to local subscribers table
      const { error: dbError } = await supabase
        .from('subscribers')
        .insert({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          source: data.source || 'HerbMe Site',
          tags: data.tags || ['herbme', 'website'],
        });

      if (dbError) {
        // Check if it's a duplicate email error
        if (dbError.code === '23505') {
          toast({
            title: "Already subscribed!",
            description: "You're already part of the HerbMe family. Check your email for our latest updates.",
          });
          return { success: true, message: "Already subscribed" };
        }
        throw dbError;
      }

      // Sync to Brevo via edge function
      const { error: syncError } = await supabase.functions.invoke('brevo-sync', {
        body: data
      });

      if (syncError) {
        console.warn('Brevo sync failed:', syncError);
        // Don't fail the whole operation if Brevo sync fails
      }

      toast({
        title: "Welcome to HerbMe! 🌿",
        description: "You've successfully joined our natural skincare community. Check your email for a welcome message!",
      });

      return { success: true, message: "Successfully subscribed" };
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "Something went wrong. Please try again or contact us for help.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async (email: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('subscribers')
        .update({ 
          is_subscribed: false, 
          unsubscribed_at: new Date().toISOString() 
        })
        .eq('email', email);

      if (error) throw error;

      toast({
        title: "Unsubscribed",
        description: "You've been removed from our newsletter. We're sorry to see you go!",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Unsubscribe error:', error);
      toast({
        title: "Error",
        description: "Failed to unsubscribe. Please contact us for help.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscribe,
    unsubscribe,
    isLoading,
  };
};