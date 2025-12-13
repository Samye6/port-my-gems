import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Sparkles, MessageCircle, Image, Zap, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import lydiaLogo from "@/assets/lydia-logo.png";

// SVG Logo component for Premium badge with gold glow
const LydiaGoldLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <img 
      src={lydiaLogo} 
      alt="Lydia Premium" 
      className="w-full h-full object-contain"
      style={{
        filter: 'brightness(1.2) sepia(1) hue-rotate(10deg) saturate(1.5)',
      }}
    />
    <div 
      className="absolute inset-0 rounded-full"
      style={{
        boxShadow: '0 0 20px hsl(45 100% 50% / 0.5)',
        pointerEvents: 'none',
      }}
    />
  </div>
);

// SVG Star icon for VIP badge with violet/magenta gradient
const VipStarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <defs>
      <linearGradient id="vipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(280 80% 60%)" />
        <stop offset="50%" stopColor="hsl(320 90% 55%)" />
        <stop offset="100%" stopColor="hsl(340 85% 50%)" />
      </linearGradient>
    </defs>
    <path 
      d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" 
      fill="url(#vipGradient)"
      stroke="url(#vipGradient)"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Subscriptions = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "premium",
      name: "Premium",
      price: "19,99€",
      period: "/mois",
      recommended: false,
      isPrimary: true,
      features: [
        "Accès illimité à tous les scénarios Fantasy",
        "Messages et photos illimités",
        "IA immersive",
      ],
      noVip: true,
    },
    {
      id: "premium-plus",
      name: "Premium+",
      price: "29,99€",
      period: "/mois",
      recommended: true,
      isPrimary: false,
      features: [
        "Accès illimité à tous les scénarios Fantasy",
        "Messages et photos illimités",
        "IA avancée (mémoire, continuité, personnalisation)",
        "1 Crédit VIP / mois (catégorie Populaire)",
      ],
      highlight: "Le crédit VIP se renouvelle chaque mois",
    },
    {
      id: "free",
      name: "Gratuit",
      price: "0€",
      period: "",
      features: [
        "1 à 2 scénarios Fantasy gratuits",
        "Messages limités",
        "Quelques photos teasing",
        "IA de base",
      ],
    },
  ];

  const vipTiers = [
    {
      id: "standard",
      name: "Standard",
      price: "9,99€",
      description: "Créatrices accessibles",
    },
    {
      id: "populaire",
      name: "Populaire",
      price: "14,99€",
      description: "Créatrices très demandées",
      popular: true,
    },
    {
      id: "top-x",
      name: "TOP X",
      price: "24,99€",
      description: "Créatrices exclusives",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div 
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10"
        style={{
          background: `
            linear-gradient(180deg, 
              hsl(270 30% 12% / 0.95) 0%, 
              hsl(330 20% 10% / 0.9) 100%
            )
          `,
        }}
      >
        <div className="px-4 py-4 flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Abonnements & Accès VIP</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-6 animate-fade-in">
          <div 
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(45 100% 55%) 0%, hsl(35 100% 50%) 100%)',
              boxShadow: '0 0 60px hsl(45 100% 50% / 0.4)',
            }}
          >
            <LydiaGoldLogo className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Choisis ton expérience
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Débloquez l'univers Lydia avec l'offre qui vous correspond
          </p>
        </div>

        {/* Plans Grid */}
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden border-2 transition-all duration-300 animate-fade-in ${
                plan.isPrimary
                  ? "border-amber-500/50 scale-[1.02]"
                  : plan.recommended
                    ? "border-violet-500/40"
                    : "border-white/10 hover:border-white/20"
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                background: plan.isPrimary 
                  ? `linear-gradient(135deg, 
                      hsl(45 100% 35% / 0.2) 0%, 
                      hsl(35 100% 45% / 0.15) 30%,
                      hsl(270 30% 15% / 0.4) 100%
                    )`
                  : plan.recommended
                    ? `linear-gradient(135deg, 
                        hsl(270 40% 20% / 0.3) 0%, 
                        hsl(330 30% 15% / 0.2) 100%
                      )`
                    : 'linear-gradient(135deg, hsl(270 30% 15% / 0.4) 0%, hsl(330 20% 12% / 0.3) 100%)',
                boxShadow: plan.isPrimary ? '0 0 40px hsl(45 100% 50% / 0.15)' : 'none',
              }}
            >
              {/* Recommended Badge for Premium+ */}
              {plan.recommended && (
                <div 
                  className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-b-xl text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, hsl(280 70% 50%) 0%, hsl(320 80% 50%) 100%)',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <VipStarIcon className="w-3.5 h-3.5" />
                    Recommandé
                  </div>
                </div>
              )}

              <div className="p-6 pt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      {(plan.isPrimary || plan.recommended) && (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, hsl(45 100% 55%) 0%, hsl(35 100% 50%) 100%)',
                            boxShadow: '0 0 15px hsl(45 100% 50% / 0.4)',
                          }}
                        >
                          <LydiaGoldLogo className="w-5 h-5" />
                        </div>
                      )}
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span 
                        className={`text-4xl font-bold ${
                          plan.isPrimary 
                            ? 'bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent' 
                            : plan.recommended
                              ? 'text-violet-400'
                              : 'text-primary'
                        }`}
                      >
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  <Button
                    className={`shrink-0 px-8 py-6 rounded-2xl font-semibold transition-all ${
                      plan.id === "free"
                        ? "bg-white/10 text-foreground hover:bg-white/15"
                        : plan.isPrimary
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black shadow-lg shadow-amber-500/30"
                          : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/20"
                    }`}
                    disabled={plan.id === "free"}
                  >
                    {plan.id === "free" ? "Plan actuel" : "Choisir ce plan"}
                  </Button>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.isPrimary ? 'bg-amber-500/20' : plan.recommended ? 'bg-violet-500/20' : 'bg-pink-500/20'
                      }`}>
                        <Check className={`w-3.5 h-3.5 ${
                          plan.isPrimary ? 'text-amber-400' : plan.recommended ? 'text-violet-400' : 'text-pink-400'
                        }`} />
                      </div>
                      <span className="text-sm text-foreground/90">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.noVip && (
                    <div className="flex items-start gap-3 opacity-60">
                      <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-white/10">
                        <span className="text-xs text-muted-foreground">✕</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Aucun accès VIP inclus</span>
                    </div>
                  )}

                  {plan.highlight && (
                    <div className="mt-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                      <p className="text-xs text-violet-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {plan.highlight}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* VIP Section Separator */}
        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <div className="px-6 py-2 rounded-full bg-background border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <VipStarIcon className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">Accès additionnel</span>
              </div>
            </div>
          </div>
        </div>

        {/* VIP Section - More desirable with violet/magenta gradient */}
        <div 
          className="rounded-3xl p-6 sm:p-8 border-2"
          style={{
            background: `
              linear-gradient(135deg, 
                hsl(280 60% 20% / 0.5) 0%, 
                hsl(320 70% 18% / 0.4) 50%,
                hsl(340 60% 15% / 0.3) 100%
              )
            `,
            borderColor: 'hsl(300 70% 45% / 0.4)',
            boxShadow: '0 0 60px hsl(300 80% 50% / 0.15), inset 0 1px 1px hsl(300 80% 60% / 0.1)',
          }}
        >
          <div className="text-center space-y-3 mb-8">
            <div className="flex items-center justify-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(280 70% 50%) 0%, hsl(320 80% 50%) 100%)',
                  boxShadow: '0 0 25px hsl(300 80% 50% / 0.5)',
                }}
              >
                <VipStarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Discussions VIP (Verified)</h3>
            </div>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Discute avec de vraies créatrices. Photos & vidéos exclusives, style "selfie réel". 
              Une autre dimension de connexion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {vipTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative p-5 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer ${
                  tier.popular 
                    ? 'border-fuchsia-500/50 bg-fuchsia-500/15' 
                    : 'border-white/10 bg-white/5 hover:border-violet-500/30'
                }`}
                style={{
                  boxShadow: tier.popular ? '0 0 30px hsl(300 80% 50% / 0.2)' : 'none',
                }}
              >
                {tier.popular && (
                  <div 
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, hsl(280 70% 50%) 0%, hsl(320 80% 50%) 100%)',
                    }}
                  >
                    Populaire
                  </div>
                )}
                
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-foreground">{tier.name}</h4>
                  <p 
                    className="text-2xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, hsl(280 70% 60%) 0%, hsl(320 80% 55%) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {tier.price}
                  </p>
                  <p className="text-xs text-muted-foreground">{tier.description}</p>
                </div>

                <Button 
                  className="w-full mt-4 rounded-xl text-foreground text-sm"
                  style={{
                    background: 'linear-gradient(135deg, hsl(280 60% 40% / 0.3) 0%, hsl(320 70% 40% / 0.3) 100%)',
                    borderColor: 'hsl(300 60% 50% / 0.3)',
                  }}
                  size="sm"
                >
                  Acheter
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 opacity-60">
            Les créatrices perçoivent 60% des ventes.
          </p>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground space-y-2 pt-4 pb-8">
          <p>Annulation possible à tout moment</p>
          <p>Paiement sécurisé • Facturation mensuelle</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Subscriptions;
