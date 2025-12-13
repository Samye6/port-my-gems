import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import logoGold from "@/assets/logo-gold.png";
import logoPlatinum from "@/assets/logo-platinum.png";

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
      logo: logoGold,
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
      logo: logoPlatinum,
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
      name: "Découverte",
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
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-6 animate-fade-in">
          <div 
            className="w-20 h-20 mx-auto flex items-center justify-center"
            style={{
              filter: 'drop-shadow(0 0 30px hsl(45 100% 50% / 0.5))',
            }}
          >
            <img 
              src={logoGold} 
              alt="Lydia Premium" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Choisis ton expérience
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Débloquez l'univers Lydia avec l'offre qui vous correspond
          </p>
        </div>

        {/* Plans Grid - 3 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden border-2 transition-all duration-300 animate-fade-in ${
                plan.isPrimary
                  ? "border-amber-500/60 lg:scale-105 lg:z-10"
                  : plan.recommended
                    ? "border-white/20"
                    : "border-white/5 hover:border-white/10"
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                background: plan.isPrimary 
                  ? `linear-gradient(145deg, 
                      hsl(45 80% 30% / 0.25) 0%, 
                      hsl(38 70% 25% / 0.2) 40%,
                      hsl(270 25% 12% / 0.6) 100%
                    )`
                  : plan.recommended
                    ? `linear-gradient(145deg, 
                        hsl(0 0% 8% / 0.95) 0%, 
                        hsl(270 15% 8% / 0.9) 50%,
                        hsl(280 20% 6% / 0.95) 100%
                      )`
                    : 'linear-gradient(145deg, hsl(270 15% 10% / 0.3) 0%, hsl(270 10% 8% / 0.2) 100%)',
                boxShadow: plan.isPrimary 
                  ? '0 0 50px hsl(45 100% 50% / 0.2), 0 20px 40px -20px hsl(45 100% 40% / 0.3)' 
                  : plan.recommended
                    ? '0 0 40px hsl(0 0% 0% / 0.5), inset 0 1px 0 hsl(0 0% 20% / 0.2)'
                    : 'none',
                opacity: plan.id === 'free' ? 0.75 : 1,
              }}
            >
              {/* Recommended Badge for Premium+ - Discret */}
              {plan.recommended && (
                <div 
                  className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 rounded-b-lg text-[10px] font-medium tracking-wide text-white/80"
                  style={{
                    background: 'linear-gradient(135deg, hsl(270 30% 25%) 0%, hsl(280 25% 20%) 100%)',
                    borderBottom: '1px solid hsl(270 30% 35% / 0.3)',
                  }}
                >
                  Recommandé
                </div>
              )}

              <div className={`p-6 ${plan.recommended ? 'pt-10' : 'pt-6'}`}>
                {/* Logo & Title */}
                <div className="flex items-center gap-3 mb-4">
                  {plan.logo && (
                    <img 
                      src={plan.logo} 
                      alt={`Logo ${plan.name}`}
                      className="w-10 h-10 object-contain"
                      style={{
                        filter: plan.isPrimary 
                          ? 'drop-shadow(0 0 12px hsl(45 100% 50% / 0.6))' 
                          : 'drop-shadow(0 0 10px hsl(0 0% 30% / 0.5))',
                      }}
                    />
                  )}
                  <h3 className={`text-xl font-bold ${
                    plan.isPrimary 
                      ? 'text-amber-200' 
                      : plan.recommended 
                        ? 'text-white/90' 
                        : 'text-foreground/70'
                  }`}>
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                  <span 
                    className={`text-3xl font-bold ${
                      plan.isPrimary 
                        ? 'bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent' 
                        : plan.recommended
                          ? 'text-white/80'
                          : 'text-foreground/60'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`${plan.id === 'free' ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full py-5 rounded-xl font-semibold transition-all mb-6 ${
                    plan.id === "free"
                      ? "bg-white/5 text-foreground/50 hover:bg-white/10 border border-white/5"
                      : plan.isPrimary
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/30"
                        : "bg-white/10 text-white/80 hover:bg-white/15 border border-white/10"
                  }`}
                  disabled={plan.id === "free"}
                >
                  {plan.id === "free" ? "Plan actuel" : "Choisir ce plan"}
                </Button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.isPrimary 
                          ? 'bg-amber-500/25' 
                          : plan.recommended 
                            ? 'bg-white/10' 
                            : 'bg-white/5'
                      }`}>
                        <Check className={`w-3.5 h-3.5 ${
                          plan.isPrimary 
                            ? 'text-amber-400' 
                            : plan.recommended 
                              ? 'text-white/70' 
                              : 'text-white/40'
                        }`} />
                      </div>
                      <span className={`text-sm ${
                        plan.id === 'free' ? 'text-foreground/50' : 'text-foreground/80'
                      }`}>{feature}</span>
                    </div>
                  ))}
                  
                  {plan.noVip && (
                    <div className="flex items-start gap-3 opacity-50">
                      <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-white/5">
                        <span className="text-xs text-muted-foreground">✕</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Aucun accès VIP inclus</span>
                    </div>
                  )}

                  {plan.highlight && (
                    <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-white/60 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-400/60" />
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
            <div className="px-6 py-2 rounded-full bg-background border border-violet-500/20 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <VipStarIcon className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">Accès additionnel</span>
              </div>
            </div>
          </div>
        </div>

        {/* VIP Section - Premium violet gradient */}
        <div 
          className="rounded-3xl p-6 sm:p-8 border-2"
          style={{
            background: `
              linear-gradient(145deg, 
                hsl(280 55% 18% / 0.6) 0%, 
                hsl(300 60% 15% / 0.5) 40%,
                hsl(320 55% 12% / 0.4) 100%
              )
            `,
            borderColor: 'hsl(290 65% 40% / 0.5)',
            boxShadow: '0 0 80px hsl(290 80% 45% / 0.2), inset 0 1px 1px hsl(290 80% 60% / 0.15)',
          }}
        >
          <div className="text-center space-y-3 mb-8">
            <div className="flex items-center justify-center gap-3">
              <div 
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(280 70% 45%) 0%, hsl(310 75% 45%) 100%)',
                  boxShadow: '0 0 30px hsl(290 80% 50% / 0.5)',
                }}
              >
                <VipStarIcon className="w-7 h-7" />
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
                className="relative p-5 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer border-violet-500/30 hover:border-violet-400/50"
                style={{
                  background: 'linear-gradient(145deg, hsl(280 40% 20% / 0.4) 0%, hsl(300 45% 15% / 0.3) 100%)',
                  boxShadow: '0 0 25px hsl(290 70% 40% / 0.15)',
                }}
              >
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-foreground">{tier.name}</h4>
                  <p 
                    className="text-2xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, hsl(280 70% 65%) 0%, hsl(320 80% 60%) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {tier.price}
                  </p>
                  <p className="text-xs text-muted-foreground">{tier.description}</p>
                </div>

                <Button 
                  className="w-full mt-4 rounded-xl text-foreground text-sm border"
                  style={{
                    background: 'linear-gradient(135deg, hsl(280 50% 35% / 0.4) 0%, hsl(310 55% 35% / 0.4) 100%)',
                    borderColor: 'hsl(290 50% 45% / 0.4)',
                  }}
                  size="sm"
                >
                  Acheter
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 opacity-50">
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
