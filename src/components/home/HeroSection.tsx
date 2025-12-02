import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import exclusiveModel from "@/assets/exclusive-model.png";

interface HeroSectionProps {
  onStartChat: () => void;
  isAuthenticated: boolean;
}

const HeroSection = ({ onStartChat, isAuthenticated }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClick = () => {
    if (isAuthenticated) {
      onStartChat();
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-purple-950/30 to-primary/20" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] animate-pulse delay-500" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Hero Image */}
      <div className="absolute right-0 bottom-0 w-1/2 h-full">
        <img 
          src={exclusiveModel} 
          alt="Featured" 
          className={`absolute bottom-0 right-0 h-[95%] w-auto object-contain transition-all duration-1000 ${isVisible ? 'opacity-80 translate-x-0' : 'opacity-0 translate-x-20'}`}
          style={{
            filter: 'drop-shadow(0 0 60px rgba(255, 77, 141, 0.3))',
            maskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
          }}
        />
        {/* Glow effect behind image */}
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-primary/20 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-6 py-20 flex flex-col justify-center min-h-[70vh]">
        <div className={`max-w-xl space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Nouveau match disponible</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-foreground">Ton match</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-pink-400 to-purple-400 bg-clip-text text-transparent">
              du moment
            </span>
            <br />
            <span className="text-foreground">t'attend…</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-md">
            Découvre des conversations intimes et personnalisées avec des personnalités uniques qui n'attendent que toi.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={handleClick}
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-[0_0_40px_rgba(255,77,141,0.4)] hover:shadow-[0_0_60px_rgba(255,77,141,0.6)] transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Parler maintenant
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/premium")}
              className="group px-8 py-6 text-lg font-semibold rounded-full border-2 border-amber-400/50 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Découvrir Premium
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">50K+</p>
              <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">4.9</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Heart className="w-3 h-3 fill-primary text-primary" /> Note moyenne
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-sm text-muted-foreground">Disponible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
