import { useNavigate } from "react-router-dom";
import { Crown, Flame, MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PremiumBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="container px-6 py-8">
      <div 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-amber-950/80 border border-amber-400/30 p-8 group cursor-pointer hover:border-amber-400/50 transition-all duration-500"
        onClick={() => navigate("/premium")}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(251,191,36,0.1),transparent_50%)]" />
        
        {/* Animated Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-amber-600/20 to-amber-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
          {/* Left: Crown Icon */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.4)]">
              <Crown className="w-10 h-10 text-black" />
            </div>
          </div>

          {/* Center: Benefits */}
          <div className="flex-grow text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Passe en mode{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Premium
              </span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Débloque l'expérience complète et profite de tous les avantages
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/30 border border-amber-400/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Scénarios exclusifs</p>
                  <p className="text-xs text-muted-foreground">Contenus uniques</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/30 border border-amber-400/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Messages illimités</p>
                  <p className="text-xs text-muted-foreground">Sans restriction</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/30 border border-amber-400/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
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
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold px-8 py-6 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] transition-all duration-300 group/btn"
            >
              Découvrir Premium
              <ChevronRight className="w-5 h-5 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
            <Crown className="w-3 h-3" />
            VIP
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumBanner;
