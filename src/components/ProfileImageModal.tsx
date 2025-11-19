import { X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  name: string;
}

const ProfileImageModal = ({ isOpen, onClose, imageUrl, name }: ProfileImageModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-card/50 hover:bg-card transition-colors"
      >
        <X className="w-6 h-6 text-foreground" />
      </button>
      
      <div 
        className="relative max-w-2xl max-h-[80vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar className="w-full h-full rounded-2xl">
          {imageUrl && <AvatarImage src={imageUrl} alt={name} className="object-cover" />}
          <AvatarFallback className="bg-primary/20 text-primary text-9xl rounded-2xl">
            {name[0]}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default ProfileImageModal;
