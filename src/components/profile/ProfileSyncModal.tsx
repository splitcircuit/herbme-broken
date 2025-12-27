// Profile Sync Modal
// Shows when a guest with a local profile logs in

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserCircle, Upload, X } from 'lucide-react';

interface ProfileSyncModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSync: () => Promise<void>;
  onSkip: () => void;
}

export function ProfileSyncModal({
  open,
  onOpenChange,
  onSync,
  onSkip,
}: ProfileSyncModalProps) {
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
      onOpenChange(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <UserCircle className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Save Your Skin Profile?</DialogTitle>
          <DialogDescription className="text-center">
            We found a skin profile you created before signing in. Would you like to save it to your account?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p>Saving your profile means:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Personalized scan results on any device</li>
            <li>Custom oil builder recommendations</li>
            <li>Your preferences stay synced</li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Not Now
          </Button>
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full sm:w-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isSyncing ? 'Saving...' : 'Save to Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
