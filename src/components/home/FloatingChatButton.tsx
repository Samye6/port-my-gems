import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton = ({ onClick }: FloatingChatButtonProps) => {
  return (
    <div className="fixed bottom-24 right-6 z-40">
      <Button
        onClick={onClick}
        className="group relative overflow-hidden bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white px-6 py-6 rounded-full shadow-[0_0_30px_rgba(255,77,141,0.4)] hover:shadow-[0_0_50px_rgba(255,77,141,0.6)] transition-all duration-300 hover:scale-105"
      >
        {/* Pulse Ring */}
        <div className="absolute inset-0 rounded-full bg-primary/50 animate-ping opacity-25" />
        
        <MessageCircle className="w-6 h-6 mr-2 group-hover:animate-pulse" />
        <span className="font-semibold">Nouvelle conversation</span>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </Button>
    </div>
  );
};

export default FloatingChatButton;
