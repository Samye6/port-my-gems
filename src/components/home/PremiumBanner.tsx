import { useNavigate } from "react-router-dom";
import { Crown, Flame, MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PremiumBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="container px-6 py-10">
      <div 
        className="relative overflow-hidden rounded-3xl glass-gold p-8 group cursor-pointer hover:border-gold/50 transition-all duration-500"
        onClick={() => navigate("/premium")}
        style={{
          boxShadow: '0 20px 80px rgba(251, 191, 36, 0.15), 0 0 40px rgba(255, 178, 156, 0.1)',
        }}
      >
        {/* Background Gradient Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,178,156,0.15),transparent_50%)]" />
        
        {/* Animated Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 via-peach/20 to-gold/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
          {/* Left: Crown Icon */}
          <div className="flex-shrink-0">
            <div 
              className="w-20 h-20 rounded-full bg-gradient-to-br from-gold via-amber-400 to-peach flex items-center justify-center"
              style={{
                boxShadow: '0 0 50px rgba(251, 191, 36, 0.5), 0 0 100px rgba(255, 178, 156, 0.3)',
              }}
            >
              <Crown className="w-10 h-10 text-black" />
            </div>
          </div>

          {/* Center: Benefits */}
          <div className="flex-grow text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Passe en mode{" "}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, hsl(43 96% 56%) 0%, hsl(20 100% 75%) 50%, hsl(43 96% 66%) 100%)',
                }}
              >
                Premium
              </span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Débloque l'expérience complète et profite de tous les avantages
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass border-gold/20">
                <div 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)' }}
                >
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Scénarios exclusifs</p>
                  <p className="text-xs text-muted-foreground">Contenus uniques</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass border-gold/20">
                <div 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: '0 0 20px rgba(255, 77, 141, 0.4)' }}
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Messages illimités</p>
                  <p className="text-xs text-muted-foreground">Sans restriction</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass border-gold/20">
                <div 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-purple flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Personnages VIP</p>
                  <p className="text-xs text-muted-foreground">Accès complet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex-shrink-0">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-gold via-amber-400 to-peach hover:from-gold hover:via-amber-500 hover:to-peach-light text-black font-bold px-8 py-6 rounded-full transition-all duration-300 group/btn"
              style={{
                boxShadow: '0 0 40px rgba(251, 191, 36, 0.4), 0 0 80px rgba(255, 178, 156, 0.2)',
              }}
            >
              Découvrir Premium
              <ChevronRight className="w-5 h-5 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <div 
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-gold to-peach text-black text-xs font-bold flex items-center gap-1.5 animate-pulse"
            style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}
          >
            <Crown className="w-3 h-3" />
            VIP
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumBanner;
