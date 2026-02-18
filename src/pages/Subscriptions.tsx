import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import logoGold from "@/assets/logo-gold.png";
import logoPlatinum from "@/assets/logo-platinum.png";

// SVG Star icon for VIP badge with violet/magenta gradient
const VipStarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
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

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  isBestSeller?: boolean;
  isExclusive?: boolean;
  isPrimary?: boolean;
  logo?: string;
  features: string[];
  noVip?: boolean;
  highlight?: string;
}

const Subscriptions = () => {
  const navigate = useNavigate();

  const plans: Plan[] = [
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
    {
      id: "premium",
      name: "Premium",
      price: "19,99€",
      period: "/mois",
      isBestSeller: true,
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
      isExclusive: true,
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

  const getCardStyles = (plan: Plan) => {
    if (plan.id === "free") {
      return {
        background: `linear-gradient(145deg, hsl(0 0% 8% / 0.9) 0%, hsl(0 0% 6% / 0.95) 100%)`,
        border: "hsl(0 0% 20% / 0.3)",
        borderWidth: "1px",
        shadow: "none",
      };
    }
    if (plan.isPrimary) {
      // Premium — rose/magenta chaud
      return {
        background: `linear-gradient(145deg,
          hsl(335 55% 18% / 0.9) 0%,
          hsl(320 60% 14% / 0.85) 50%,
          hsl(310 50% 11% / 0.8) 100%
        )`,
        border: "hsl(335 80% 55% / 0.6)",
        borderWidth: "1.5px",
        shadow: `
          0 0 60px hsl(335 85% 55% / 0.3),
          0 0 100px hsl(320 80% 50% / 0.15),
          inset 0 1px 0 hsl(335 80% 65% / 0.2)
        `,
      };
    }
    if (plan.isExclusive) {
      // Premium+ — violet profond / or
      return {
        background: `linear-gradient(145deg,
          hsl(270 55% 16% / 0.95) 0%,
          hsl(260 50% 12% / 0.9) 50%,
          hsl(245 45% 9% / 0.95) 100%
        )`,
        border: "hsl(270 65% 50% / 0.55)",
        borderWidth: "1.5px",
        shadow: `
          0 0 60px hsl(270 70% 50% / 0.25),
          0 0 100px hsl(260 60% 45% / 0.12),
          inset 0 1px 0 hsl(270 70% 60% / 0.2),
          inset 0 -1px 0 hsl(45 80% 50% / 0.08)
        `,
      };
    }
    return {
      background: "hsl(0 0% 8%)",
      border: "hsl(0 0% 15%)",
      borderWidth: "1px",
      shadow: "none",
    };
  };

  const getBadge = (plan: Plan) => {
    if (plan.isBestSeller) {
      return {
        label: "🔥 Best Seller",
        background: "linear-gradient(135deg, hsl(335 85% 55%) 0%, hsl(350 90% 60%) 100%)",
        color: "hsl(0 0% 100%)",
        shadow: "0 4px 20px hsl(335 85% 55% / 0.5)",
        border: "none",
      };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10"
        style={{
          background: `linear-gradient(180deg, hsl(270 30% 12% / 0.95) 0%, hsl(330 20% 10% / 0.9) 100%)`,
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
        <div className="text-center space-y-4 py-8 animate-fade-in">
          <h1
            className="text-5xl font-bold tracking-tight"
            style={{
              background: "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(320 40% 85%) 50%, hsl(270 50% 80%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px hsl(320 60% 60% / 0.3))",
            }}
          >
            Lydia
          </h1>
          <h2 className="text-2xl font-semibold text-foreground mt-4">
            Choisis ton expérience
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Débloquez l'univers Lydia avec l'offre qui vous correspond
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
          {plans.map((plan, index) => {
            const styles = getCardStyles(plan);
            const badge = getBadge(plan);

            return (
              <Card
                key={plan.id}
                className="relative overflow-hidden border transition-all duration-300 animate-fade-in group hover:scale-[1.02]"
                style={{
                  animationDelay: `${index * 100}ms`,
                  background: styles.background,
                  borderColor: styles.border,
                  borderWidth: styles.borderWidth,
                  borderRadius: "1.25rem",
                  boxShadow: styles.shadow,
                  minHeight: "480px",
                }}
              >
                {/* Outer glow for Premium */}
                {plan.isPrimary && (
                  <div
                    className="absolute -inset-[1px] rounded-[1.25rem] opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
                    style={{
                      boxShadow: "0 0 50px hsl(335 80% 55% / 0.3), 0 0 90px hsl(320 75% 50% / 0.15)",
                    }}
                  />
                )}

                {/* Outer glow for Premium+ */}
                {plan.isExclusive && (
                  <div
                    className="absolute -inset-[1px] rounded-[1.25rem] opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
                    style={{
                      boxShadow: "0 0 50px hsl(270 65% 50% / 0.25), 0 0 90px hsl(260 55% 45% / 0.12)",
                    }}
                  />
                )}

                {/* Diagonal shimmer for Premium+ */}
                {plan.isExclusive && (
                  <div
                    className="absolute inset-0 opacity-25 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg,
                        transparent 0%,
                        hsl(270 50% 55% / 0.1) 25%,
                        transparent 50%,
                        hsl(45 80% 50% / 0.06) 75%,
                        transparent 100%
                      )`,
                      borderRadius: "1.25rem",
                    }}
                  />
                )}

                {/* Hover shine sweep */}
                {plan.id !== "free" && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden"
                    style={{ borderRadius: "1.25rem" }}
                  >
                    <div
                      className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, ${
                          plan.isPrimary
                            ? "hsl(335 100% 75% / 0.2)"
                            : "hsl(270 70% 70% / 0.15)"
                        } 50%, transparent 100%)`,
                        width: "50%",
                      }}
                    />
                  </div>
                )}

                {/* Badge */}
                {badge && (
                  <div
                    className="absolute -top-px left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-b-xl text-[11px] font-semibold tracking-wide whitespace-nowrap"
                    style={{
                      background: badge.background,
                      color: badge.color,
                      boxShadow: badge.shadow,
                      border: badge.border || "none",
                    }}
                  >
                    {badge.label}
                  </div>
                )}

                <div className={`p-6 flex flex-col h-full ${badge ? "pt-10" : "pt-6"}`}>
                  {/* Logo & Title */}
                  <div className="flex items-center gap-3 mb-4">
                    {plan.logo && (
                      <img
                        src={plan.logo}
                        alt={`Logo ${plan.name}`}
                        className="w-10 h-10 object-contain"
                        style={{
                          filter: plan.isPrimary
                            ? "drop-shadow(0 0 18px hsl(335 90% 60% / 0.8))"
                            : "drop-shadow(0 0 18px hsl(270 70% 65% / 0.6)) drop-shadow(0 0 8px hsl(45 80% 55% / 0.3)) brightness(1.1)",
                        }}
                      />
                    )}
                    <h3
                      className={`font-bold ${
                        plan.id === "free"
                          ? "text-xl text-foreground/50"
                          : plan.isPrimary
                          ? "text-xl"
                          : "text-[22px] tracking-tight"
                      }`}
                      style={
                        plan.isPrimary
                          ? {
                              background: "linear-gradient(135deg, hsl(335 90% 80%) 0%, hsl(350 80% 70%) 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }
                          : plan.isExclusive
                          ? {
                              background: "linear-gradient(135deg, hsl(270 60% 82%) 0%, hsl(45 80% 65%) 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }
                          : {}
                      }
                    >
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6">
                    <span
                      className={`text-3xl font-bold ${plan.id === "free" ? "text-foreground/40" : ""}`}
                      style={
                        plan.isPrimary
                          ? {
                              background: "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(335 70% 85%) 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }
                          : plan.isExclusive
                          ? {
                              background: "linear-gradient(135deg, hsl(45 100% 65%) 0%, hsl(35 90% 55%) 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }
                          : {}
                      }
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`${plan.id === "free" ? "text-muted-foreground/30" : "text-muted-foreground/70"}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full py-5 rounded-xl font-semibold transition-all duration-300 mb-6 ${
                      plan.id === "free"
                        ? "bg-white/5 text-foreground/40 hover:bg-white/5 border border-white/5 cursor-default"
                        : ""
                    }`}
                    style={
                      plan.isPrimary
                        ? {
                            background: "linear-gradient(135deg, hsl(335 85% 58%) 0%, hsl(350 90% 62%) 100%)",
                            color: "hsl(0 0% 100%)",
                            boxShadow: "0 8px 30px hsl(335 85% 55% / 0.45), 0 2px 8px hsl(335 80% 50% / 0.3)",
                            border: "none",
                          }
                        : plan.isExclusive
                        ? {
                            background: "linear-gradient(135deg, hsl(270 65% 45%) 0%, hsl(290 70% 42%) 50%, hsl(320 65% 40%) 100%)",
                            color: "hsl(0 0% 100%)",
                            boxShadow: "0 8px 30px hsl(270 70% 45% / 0.4), 0 2px 8px hsl(270 60% 40% / 0.25)",
                            border: "1px solid hsl(270 55% 55% / 0.3)",
                          }
                        : {}
                    }
                    disabled={plan.id === "free"}
                  >
                    {plan.id === "free" ? "Plan actuel" : "Choisir ce plan"}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{
                            background: plan.isPrimary
                              ? "hsl(335 80% 55% / 0.2)"
                              : plan.isExclusive
                              ? "hsl(270 60% 50% / 0.2)"
                              : "hsl(0 0% 100% / 0.05)",
                          }}
                        >
                          <Check
                            className="w-3.5 h-3.5"
                            style={{
                              color: plan.isPrimary
                                ? "hsl(335 90% 70%)"
                                : plan.isExclusive
                                ? "hsl(270 70% 75%)"
                                : "hsl(0 0% 100% / 0.3)",
                            }}
                          />
                        </div>
                        <span className={`text-sm ${plan.id === "free" ? "text-foreground/40" : "text-foreground/75"}`}>
                          {feature}
                        </span>
                      </div>
                    ))}

                    {plan.noVip && (
                      <div className="flex items-start gap-3 opacity-40">
                        <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-white/5">
                          <span className="text-xs text-muted-foreground">✕</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Aucun accès VIP inclus</span>
                      </div>
                    )}

                    {plan.highlight && (
                      <div
                        className="mt-4 p-3 rounded-xl"
                        style={{
                          background: "hsl(270 40% 20% / 0.3)",
                          border: "1px solid hsl(270 50% 40% / 0.2)",
                        }}
                      >
                        <p className="text-xs flex items-center gap-2" style={{ color: "hsl(270 60% 75% / 0.7)" }}>
                          <Sparkles className="w-4 h-4" style={{ color: "hsl(270 70% 70% / 0.6)" }} />
                          {plan.highlight}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
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

        {/* VIP Section */}
        <div
          className="rounded-3xl p-6 sm:p-8 border-2"
          style={{
            background: `linear-gradient(145deg,
              hsl(280 55% 18% / 0.6) 0%,
              hsl(300 60% 15% / 0.5) 40%,
              hsl(320 55% 12% / 0.4) 100%
            )`,
            borderColor: "hsl(290 65% 40% / 0.5)",
            boxShadow: "0 0 80px hsl(290 80% 45% / 0.2), inset 0 1px 1px hsl(290 80% 60% / 0.15)",
          }}
        >
          <div className="text-center space-y-3 mb-8">
            <div className="flex items-center justify-center gap-3">
              <div
                className="p-3 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, hsl(280 70% 45%) 0%, hsl(310 75% 45%) 100%)",
                  boxShadow: "0 0 30px hsl(290 80% 50% / 0.5)",
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
                  background: "linear-gradient(145deg, hsl(280 40% 20% / 0.4) 0%, hsl(300 45% 15% / 0.3) 100%)",
                  boxShadow: "0 0 25px hsl(290 70% 40% / 0.15)",
                }}
              >
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-foreground">{tier.name}</h4>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      background: "linear-gradient(135deg, hsl(280 70% 65%) 0%, hsl(320 80% 60%) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {tier.price}
                  </p>
                  <p className="text-xs text-muted-foreground">{tier.description}</p>
                </div>

                <Button
                  className="w-full mt-4 rounded-xl text-foreground text-sm border"
                  style={{
                    background: "linear-gradient(135deg, hsl(280 50% 35% / 0.4) 0%, hsl(310 55% 35% / 0.4) 100%)",
                    borderColor: "hsl(290 50% 45% / 0.4)",
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
