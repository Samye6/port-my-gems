import { useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-fade-in"
        >
          <button
            onClick={handleClose}
            className="absolute top-6 left-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Timer countdown */}
          <div className="absolute top-6 right-6 text-white text-2xl font-bold z-10">
            {timeLeft}s
          </div>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={photoUrl}
              alt="Photo éphémère"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EphemeralPhoto;
