import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

const Shop = () => {
  const navigate = useNavigate();

  const packs = [
    {
      id: "pack1",
      name: "Pack Découverte",
      photos: 10,
      price: "4.99€",
      description: "10 photos exclusives",
    },
    {
      id: "pack2",
      name: "Pack Premium",
      photos: 25,
      price: "9.99€",
      description: "25 photos haute qualité",
      popular: true,
    },
    {
      id: "pack3",
      name: "Pack Ultimate",
      photos: 50,
      price: "14.99€",
      description: "50 photos + contenu exclusif",
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
            onClick={() => navigate("/home")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Boutique</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <div className="text-center space-y-2 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground">Contenu Exclusif</h2>
          <p className="text-muted-foreground">
            Débloquez des photos et contenus premium
          </p>
        </div>

        <div className="grid gap-4">
          {packs.map((pack, index) => (
            <Card
              key={pack.id}
              className={`p-6 border-2 ${
                pack.popular
                  ? "border-primary bg-gradient-to-br from-card to-primary/5"
                  : "border-border bg-card"
              } relative animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
                  Le plus populaire
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{pack.name}</h3>
                  <p className="text-sm text-muted-foreground">{pack.description}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{pack.price}</span>
                  <span className="text-muted-foreground">une fois</span>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Bientôt disponible
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-2 pt-4">
          <p>Tous les packs sont des achats uniques</p>
          <p>Paiement sécurisé • Contenu légal et éthique</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Shop;
