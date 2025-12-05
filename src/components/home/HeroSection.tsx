import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroModel from "@/assets/hero-model.png";

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
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-violet/10 to-peach/5 animate-gradient" />
      
      {/* Violet/Peach Glow Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet/25 via-primary/15 to-peach/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-peach/20 via-pink-500/10 to-violet/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-primary/15 to-violet/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Hero Image with Premium Integration */}
      <div className="absolute right-0 bottom-0 w-1/2 h-full pointer-events-none">
        {/* Multi-layer violet/rose/peach backlight behind character */}
        <div 
          className="absolute bottom-0 right-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 80% 90% at 60% 80%, hsl(270 60% 35% / 0.5) 0%, transparent 50%),
              radial-gradient(ellipse 60% 70% at 70% 70%, hsl(330 80% 50% / 0.35) 0%, transparent 45%),
              radial-gradient(ellipse 50% 60% at 65% 75%, hsl(30 100% 70% / 0.2) 0%, transparent 40%)
            `,
          }}
        />
        
        {/* Soft glow halo around silhouette */}
        <div 
          className="absolute bottom-0 right-0 w-full h-full animate-pulse"
          style={{
            animationDuration: '4s',
            background: `
              radial-gradient(ellipse 45% 55% at 55% 65%, hsl(270 70% 50% / 0.25) 0%, transparent 50%),
              radial-gradient(ellipse 40% 50% at 60% 70%, hsl(330 85% 55% / 0.2) 0%, transparent 45%)
            `,
          }}
        />
        
        {/* Main hero image with premium integration */}
        <img 
          src={heroModel} 
          alt="Featured" 
          className={`absolute bottom-0 right-0 h-[90%] w-auto object-contain transition-all duration-1000 ${isVisible ? 'opacity-95 translate-x-0' : 'opacity-0 translate-x-20'}`}
          style={{
            filter: `
              drop-shadow(0 0 100px rgba(107, 33, 168, 0.5))
              drop-shadow(0 0 60px rgba(236, 72, 153, 0.4))
              drop-shadow(0 0 30px rgba(251, 191, 36, 0.2))
              drop-shadow(8px 12px 25px rgba(0, 0, 0, 0.6))
              contrast(1.05)
              saturate(1.1)
              brightness(0.92)
            `,
            maskImage: 'linear-gradient(to left, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%), linear-gradient(to top, black 85%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskImage: 'linear-gradient(to left, black 50%, rgba(0,0,0,0.85) 70%, transparent 95%)',
          }}
        />
        
        {/* Overlay gradient for seamless blending */}
        <div 
          className="absolute bottom-0 right-0 w-full h-full"
          style={{
            background: `
              linear-gradient(to left, transparent 30%, hsl(var(--background)) 95%),
              linear-gradient(to top, hsl(var(--background)) 0%, transparent 20%)
            `,
            pointerEvents: 'none'
          }}
        />
        
        {/* Subtle warm color overlay for cohesion */}
        <div 
          className="absolute bottom-0 right-0 w-full h-full mix-blend-soft-light opacity-30"
          style={{
            background: 'linear-gradient(135deg, hsl(270 50% 40% / 0.3) 0%, hsl(330 70% 50% / 0.2) 50%, hsl(30 90% 60% / 0.15) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-6 py-20 flex flex-col justify-center min-h-[70vh]">
        <div className={`max-w-xl space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Nouveau match disponible</span>
          </div>

          {/* Main Title with Premium Gradient */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-foreground">Ton match</span>
            <br />
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, hsl(338 100% 55%) 0%, hsl(280 70% 60%) 50%, hsl(20 100% 75%) 100%)',
              }}
            >
              du moment
            </span>
            <br />
            <span className="text-foreground">t'attend…</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-md">
            Découvre des conversations intimes et personnalisées avec des personnalités uniques qui n'attendent que toi.
          </p>

          {/* CTA Buttons with Glassmorphism */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={handleClick}
              className="group relative overflow-hidden bg-gradient-to-r from-primary via-pink-500 to-violet text-white px-8 py-6 text-lg font-semibold rounded-full shadow-[0_0_50px_rgba(255,77,141,0.4),0_0_100px_rgba(139,92,246,0.2)] hover:shadow-[0_0_70px_rgba(255,77,141,0.6),0_0_120px_rgba(139,92,246,0.3)] transition-all duration-500 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Parler maintenant
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/premium")}
              className="group px-8 py-6 text-lg font-semibold rounded-full glass border-2 border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-all duration-300"
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
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
};

export default HeroSection;
