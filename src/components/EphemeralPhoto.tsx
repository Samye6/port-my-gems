import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EphemeralPhotoProps {
  messageId: string;
  photoUrl: string;
  isViewed: boolean;
  onView: (messageId: string) => void;
}

const EphemeralPhoto = ({ messageId, photoUrl, isViewed, onView }: EphemeralPhotoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isViewed) {
      setIsOpen(true);
      onView(messageId);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={handleOpen}
        className={cn(
          "relative w-48 h-48 rounded-2xl overflow-hidden cursor-pointer",
          "bg-card border-2 border-primary/20",
          isViewed && "opacity-60"
        )}
      >
        <img
          src={photoUrl}
          alt="Photo éphémère"
          className={cn(
            "w-full h-full object-cover",
            isViewed && "blur-xl"
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="text-center">
            <Eye className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-white text-sm font-medium">
              {isViewed ? "Photo vue" : "Voir une fois"}
            </p>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-fade-in"
          onClick={handleClose}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-card/50 hover:bg-card transition-colors"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={photoUrl}
              alt="Photo éphémère"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EphemeralPhoto;
