import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, Star, Sparkles, MessageCircle, Image, Zap, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

const Subscriptions = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "premium-plus",
      name: "Premium+",
      price: "24,99€",
      period: "/mois",
      recommended: true,
      features: [
        "Accès illimité à tous les scénarios Fantasy",
        "Messages et photos illimités",
        "IA avancée (mémoire, continuité, personnalisation)",
        "1 Crédit VIP inclus / mois",
      ],
      highlight: "Le crédit VIP se renouvelle chaque mois",
    },
    {
      id: "premium",
      name: "Premium",
      price: "19,99€",
      period: "/mois",
      recommended: false,
      features: [
        "Accès illimité à tous les scénarios Fantasy",
        "Messages et photos illimités",
        "IA immersive",
      ],
      noVip: true,
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
            <Crown className="w-10 h-10 text-black" />
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
                plan.recommended
                  ? "border-amber-500/50 scale-[1.02]"
                  : "border-white/10 hover:border-white/20"
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                background: plan.recommended 
                  ? `linear-gradient(135deg, 
                      hsl(45 100% 35% / 0.2) 0%, 
                      hsl(35 100% 45% / 0.15) 30%,
                      hsl(270 30% 15% / 0.4) 100%
                    )`
                  : 'linear-gradient(135deg, hsl(270 30% 15% / 0.4) 0%, hsl(330 20% 12% / 0.3) 100%)',
                boxShadow: plan.recommended ? '0 0 40px hsl(45 100% 50% / 0.15)' : 'none',
              }}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div 
                  className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-b-xl text-xs font-bold text-black"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 100% 55%) 0%, hsl(35 100% 50%) 100%)',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    Recommandé
                  </div>
                </div>
              )}

              <div className="p-6 pt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      {plan.recommended && <Crown className="w-6 h-6 text-amber-400" />}
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span 
                        className={`text-4xl font-bold ${
                          plan.recommended 
                            ? 'bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent' 
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
                        : plan.recommended
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
                        plan.recommended ? 'bg-amber-500/20' : 'bg-pink-500/20'
                      }`}>
                        <Check className={`w-3.5 h-3.5 ${plan.recommended ? 'text-amber-400' : 'text-pink-400'}`} />
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
                    <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs text-amber-300 flex items-center gap-2">
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
                <Star className="w-4 h-4 text-pink-400" />
                <span className="text-sm text-muted-foreground">Accès additionnel</span>
              </div>
            </div>
          </div>
        </div>

        {/* VIP Section */}
        <div 
          className="rounded-3xl p-6 sm:p-8 border border-white/10"
          style={{
            background: `
              linear-gradient(135deg, 
                hsl(330 40% 15% / 0.4) 0%, 
                hsl(270 30% 12% / 0.3) 50%,
                hsl(330 30% 10% / 0.2) 100%
              )
            `,
          }}
        >
          <div className="text-center space-y-3 mb-8">
            <div className="flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-pink-400 fill-pink-400" />
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
                    ? 'border-pink-500/40 bg-pink-500/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-pink-500 text-[10px] font-bold text-white">
                    Populaire
                  </div>
                )}
                
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-foreground">{tier.name}</h4>
                  <p className="text-2xl font-bold text-pink-400">{tier.price}</p>
                  <p className="text-xs text-muted-foreground">{tier.description}</p>
                </div>

                <Button 
                  className="w-full mt-4 rounded-xl bg-white/10 hover:bg-white/15 text-foreground text-sm"
                  size="sm"
                >
                  Acheter
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 opacity-60">
            💰 Les créatrices perçoivent 60% des ventes.
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
