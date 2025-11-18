import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center text-center space-y-8 max-w-md">
        {/* Icon with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-icon-glow/10 p-6 rounded-2xl border border-primary/20">
            <MessageCircle className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-foreground tracking-tight">
          Lydia
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-muted-foreground">
          Conversations immersives avec une IA réaliste
        </p>

        {/* CTA Button */}
        <Button 
          size="lg"
          className="px-12 py-6 text-lg font-medium rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
          onClick={() => navigate("/chat")}
        >
          Commencer
        </Button>
      </div>
    </div>
  );
};

export default Index;
