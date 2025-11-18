import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

const Premium = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "free",
      name: "Gratuit",
      price: "0€",
      period: "",
      features: [
        "5 messages par jour",
        "Scénarios basiques",
        "1 personnage",
        "Publicités",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "9.99€",
      period: "/mois",
      features: [
        "Messages illimités",
        "Tous les scénarios",
        "Personnages multiples",
        "Pas de publicités",
        "Réponses prioritaires",
        "Historique sauvegardé",
      ],
      popular: true,
    },
    {
      id: "ultimate",
      name: "Ultimate",
      price: "19.99€",
      period: "/mois",
      features: [
        "Tout Premium inclus",
        "Photos exclusives",
        "Contenu personnalisé",
        "Personnalisation avancée",
        "Support prioritaire",
        "Nouveautés en avant-première",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/profile")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Abonnements</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <div className="text-center space-y-2 animate-fade-in">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Débloquez l'expérience complète
          </h2>
          <p className="text-muted-foreground">
            Choisissez le plan qui vous correspond
          </p>
        </div>

        <div className="space-y-4">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`p-6 border-2 ${
                plan.popular
                  ? "border-primary bg-gradient-to-br from-card to-primary/5 scale-105"
                  : "border-border bg-card"
              } relative animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
                  Recommandé
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    plan.id === "free"
                      ? "bg-secondary text-foreground"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  disabled={plan.id === "free"}
                >
                  {plan.id === "free" ? "Plan actuel" : "Choisir ce plan"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-2 pt-4">
          <p>Annulation possible à tout moment</p>
          <p>Paiement sécurisé • Facturation mensuelle</p>
          <p>Essai gratuit de 7 jours disponible</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Premium;
