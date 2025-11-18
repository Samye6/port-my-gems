import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Users, Heart, Sparkles, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import BottomNav from "@/components/BottomNav";

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Scenarios = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [situation, setSituation] = useState("");

  const scenarios: Scenario[] = [
    {
      id: "boss",
      title: "La Patronne",
      description: "Une supérieure qui aime le pouvoir",
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      id: "colleague",
      title: "Collègue",
      description: "Tension au bureau",
      icon: <Users className="w-6 h-6" />,
    },
    {
      id: "stranger",
      title: "Inconnue",
      description: "Rencontre inattendue",
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      id: "ex",
      title: "L'Ex",
      description: "Le passé qui revient",
      icon: <Heart className="w-6 h-6" />,
    },
    {
      id: "married",
      title: "Femme Mariée",
      description: "Relation interdite",
      icon: <Crown className="w-6 h-6" />,
    },
    {
      id: "celebrity",
      title: "Célébrité",
      description: "Rencontre avec une star",
      icon: <Star className="w-6 h-6" />,
    },
  ];

  const handleStartChat = () => {
    if (situation.trim() && selectedScenario) {
      navigate("/chat/new", {
        state: { scenario: selectedScenario.id, situation },
      });
    }
  };

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
          <h1 className="text-xl font-semibold text-foreground">Choisir un scénario</h1>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {scenarios.map((scenario, index) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              className="aspect-square rounded-2xl bg-gradient-to-br from-card to-secondary border border-border p-4 flex flex-col items-center justify-center gap-3 hover:border-primary transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {scenario.icon}
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-1">{scenario.title}</h3>
                <p className="text-xs text-muted-foreground">{scenario.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={!!selectedScenario} onOpenChange={() => setSelectedScenario(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Décrivez la situation</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              En une ou deux phrases, décrivez le contexte de votre rencontre
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Ex: Je suis son stagiaire, elle me convoque dans son bureau après les heures de travail..."
              className="min-h-[120px] bg-secondary border-border resize-none"
            />
            <Button
              onClick={handleStartChat}
              disabled={!situation.trim()}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Commencer la conversation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Scenarios;
