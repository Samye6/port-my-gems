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
      {/* SINGLE UNIFIED BACKGROUND - One gradient covering the entire hero section */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, 
              hsl(270 50% 8%) 0%, 
              hsl(280 45% 12%) 20%,
              hsl(300 50% 14%) 40%,
              hsl(320 55% 16%) 60%,
              hsl(340 50% 14%) 80%,
              hsl(270 45% 10%) 100%
            )
          `,
        }}
      />
      
      {/* Animated soft overlay - full coverage */}
      <div 
        className="absolute inset-0 animate-gradient"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 30% 50%, hsl(270 60% 25% / 0.4) 0%, transparent 70%),
            radial-gradient(ellipse 80% 60% at 70% 50%, hsl(330 70% 30% / 0.3) 0%, transparent 70%)
          `,
        }}
      />
      
      {/* Distributed glow effects - spread across entire width */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-[600px] h-[600px] bg-gradient-to-br from-violet/30 via-primary/20 to-transparent rounded-full blur-[180px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/25 via-pink-500/15 to-transparent rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-peach/20 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/6 w-[450px] h-[450px] bg-gradient-to-br from-violet/20 via-rose-500/15 to-transparent rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Hero Image Container - TRANSPARENT background, only subtle halo */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden" style={{ background: 'transparent' }}>
        {/* Subtle radial halo BEHIND the character - blends with parent gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 80% at 60% 60%, hsl(270 60% 30% / 0.35) 0%, transparent 60%),
              radial-gradient(ellipse 60% 70% at 55% 65%, hsl(330 70% 40% / 0.25) 0%, transparent 55%)
            `,
          }}
        />
        
        {/* Breathing halo animation */}
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            animationDuration: '4s',
            background: `
              radial-gradient(ellipse 50% 60% at 55% 55%, hsl(280 70% 50% / 0.2) 0%, transparent 50%),
              radial-gradient(ellipse 45% 55% at 60% 60%, hsl(330 80% 55% / 0.15) 0%, transparent 45%)
            `,
          }}
        />
        
        {/* Main hero image */}
        <img 
          src={heroModel} 
          alt="Featured" 
          className={`absolute bottom-0 right-0 h-[95%] w-auto max-w-none object-contain transition-all duration-1000 ${isVisible ? 'opacity-95 translate-x-0' : 'opacity-0 translate-x-20'}`}
          style={{
            filter: `
              drop-shadow(0 0 80px rgba(139, 92, 246, 0.5))
              drop-shadow(0 0 50px rgba(236, 72, 153, 0.4))
              drop-shadow(0 0 25px rgba(251, 191, 36, 0.15))
              contrast(1.05)
              saturate(1.1)
              brightness(0.98)
            `,
            maskImage: 'linear-gradient(to left, black 50%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.4) 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, black 50%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.4) 90%, transparent 100%)',
          }}
        />

        {/* Single Floating Message Bubble - Clean and focused */}
        {isVisible && (
          <div 
            className="absolute top-[20%] right-[12%]"
            style={{ 
              animation: 'fade-in 0.6s ease-out 0.8s both, float-gentle 4s ease-in-out infinite 1.4s',
              zIndex: 2,
            }}
          >
            {/* Glow halo behind bubble */}
            <div 
              className="absolute inset-0 -m-3 rounded-full"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(214, 123, 255, 0.2) 0%, rgba(255, 108, 168, 0.15) 40%, transparent 70%)',
                filter: 'blur(12px)',
              }}
            />
            <div 
              className="relative px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm"
              style={{
                background: 'rgba(139, 92, 246, 0.18)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                color: '#F8F8F8',
                boxShadow: '0 0 25px rgba(214, 123, 255, 0.25), 0 0 50px rgba(255, 108, 168, 0.15), 0 4px 20px rgba(0, 0, 0, 0.25)',
              }}
            >
              Hey… tu m'as manqué 😏
            </div>
          </div>
        )}
        
        {/* Bottom fade for seamless blending */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: `linear-gradient(to top, hsl(270 45% 10%) 0%, transparent 100%)`,
            pointerEvents: 'none'
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
