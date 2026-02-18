import { useState, useEffect } from "react";
import { Camera, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EphemeralPhotoProps {
  messageId: string;
  photoUrl: string;
  isViewed: boolean;
  onView: (messageId: string) => void;
  timestamp: Date;
}

const EphemeralPhoto = ({ messageId, photoUrl, isViewed, onView, timestamp }: EphemeralPhotoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Format time as HH:MM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Timer countdown when photo is open
  useEffect(() => {
    if (isOpen && !isViewed) {
      setTimeLeft(10);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, isViewed]);

  // Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen]);

  const handleOpen = () => {
    if (!isViewed) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (!isViewed) {
      onView(messageId);
    }
  };

  return (
    <>
      <div
        onClick={handleOpen}
        className={cn(
          "inline-flex items-center gap-3 px-4 py-3 rounded-lg",
          "bg-[#1C1C1C] border border-[#2A2A2A]",
          !isViewed && "cursor-pointer hover:bg-[#232323] transition-colors"
        )}
      >
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full",
          isViewed ? "bg-[#3A3A3A]" : "bg-[#00A884]"
        )}>
          <Camera className={cn(
            "w-5 h-5",
            isViewed ? "text-gray-400" : "text-white"
          )} />
        </div>
        
        <div className="flex flex-col">
          <span className={cn(
            "text-base",
            isViewed ? "text-gray-400 italic" : "text-white font-medium"
          )}>
            {isViewed ? "Ouvert" : "Photo"}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(timestamp)}
          </span>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 left-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            style={{ marginTop: 'env(safe-area-inset-top)' }}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Timer countdown */}
          {!isViewed && (
            <div className="absolute top-6 right-6 text-white text-2xl font-bold z-10" style={{ marginTop: 'env(safe-area-inset-top)' }}>
              {timeLeft}s
            </div>
          )}

          {/* Image container */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Loading spinner */}
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}

            {/* Error state */}
            {hasError && (
              <div className="flex flex-col items-center gap-3 text-white">
                <AlertCircle className="w-12 h-12 text-red-400" />
                <p className="text-base font-medium">Impossible de charger la photo</p>
                <p className="text-sm text-white/60 text-center">Vérifie ta connexion et réessaie</p>
                <button
                  onClick={handleClose}
                  className="mt-2 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
                >
                  Fermer
                </button>
              </div>
            )}

            {/* The actual photo */}
            {!hasError && (
              <img
                src={photoUrl}
                alt="Photo éphémère"
                loading="eager"
                className={cn(
                  "max-w-full max-h-full object-contain transition-opacity duration-300",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                style={{ maxHeight: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 2rem)' }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EphemeralPhoto;
