// Barcode Scanner Modal
// Uses html5-qrcode for camera-based barcode scanning

import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Keyboard, Loader2, AlertCircle } from 'lucide-react';

interface BarcodeScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBarcodeScanned: (barcode: string) => void;
}

export function BarcodeScannerModal({
  open,
  onOpenChange,
  onBarcodeScanned,
}: BarcodeScannerModalProps) {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [manualBarcode, setManualBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && mode === 'camera') {
      startScanner();
    }
    
    return () => {
      stopScanner();
    };
  }, [open, mode]);

  const startScanner = async () => {
    if (!containerRef.current) return;
    
    setError(null);
    setIsScanning(true);

    try {
      scannerRef.current = new Html5Qrcode('barcode-scanner-container');
      
      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 100 },
          aspectRatio: 1.777,
        },
        (decodedText) => {
          handleBarcodeDetected(decodedText);
        },
        () => {
          // Ignore QR code not found errors
        }
      );
      
      setCameraPermission('granted');
    } catch (err) {
      console.error('Camera error:', err);
      setCameraPermission('denied');
      setError('Camera access denied or not available. Please use manual entry.');
      setMode('manual');
    } finally {
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        // Ignore errors when stopping
      }
      scannerRef.current = null;
    }
  };

  const handleBarcodeDetected = async (barcode: string) => {
    await stopScanner();
    onBarcodeScanned(barcode);
    onOpenChange(false);
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onBarcodeScanned(manualBarcode.trim());
      onOpenChange(false);
      setManualBarcode('');
    }
  };

  const handleClose = async () => {
    await stopScanner();
    onOpenChange(false);
    setManualBarcode('');
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
          <DialogDescription>
            Point your camera at a barcode or enter it manually
          </DialogDescription>
        </DialogHeader>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === 'camera' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('camera')}
            className="flex-1"
          >
            <Camera className="w-4 h-4 mr-2" />
            Camera
          </Button>
          <Button
            variant={mode === 'manual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { stopScanner(); setMode('manual'); }}
            className="flex-1"
          >
            <Keyboard className="w-4 h-4 mr-2" />
            Manual
          </Button>
        </div>

        {mode === 'camera' ? (
          <div className="space-y-4">
            {/* Camera View */}
            <div 
              id="barcode-scanner-container"
              ref={containerRef}
              className="w-full aspect-video bg-secondary rounded-lg overflow-hidden relative"
            >
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Position the barcode within the frame. Scanning will happen automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="manual-barcode">Enter Barcode Number</Label>
              <Input
                id="manual-barcode"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="e.g., 5060462750012"
                className="mt-1"
                onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              />
            </div>
            
            <Button 
              onClick={handleManualSubmit}
              disabled={!manualBarcode.trim()}
              className="w-full"
            >
              Use This Barcode
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
