import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface FantasyCharacter {
  id: string;
  scenario_name: string;
  slug: string;
  first_name: string;
  age: number;
  card_title: string;
  card_subtitle: string;
  recommended: boolean;
  personality_tags: string[];
  encounter_preview: string;
  starter_cta: string;
  openness: number;
  content_access_difficulty: number;
  pace: number;
  depth: number;
}

interface FantasyCharacterModalProps {
  character: FantasyCharacter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartChat: () => void;
}

const SLIDER_CONFIG = [
  { key: "openness" as const, label: "Ouverture", left: "Froide", right: "Ouverte" },
  { key: "content_access_difficulty" as const, label: "Accès aux contenus exclusifs", left: "Facile", right: "Difficile" },
  { key: "pace" as const, label: "Vitesse de progression", left: "Lent", right: "Rapide" },
  { key: "depth" as const, label: "Profondeur relationnelle", left: "Léger", right: "Complexe" },
];

const SliderBar = ({ value, label, left, right }: { value: number; label: string; left: string; right: string }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <span className="text-[10px] text-muted-foreground">{value}%</span>
    </div>
    <div className="relative h-2 w-full rounded-full bg-muted/50 overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, hsl(var(--primary) / 0.6), hsl(var(--primary)))`,
        }}
      />
    </div>
    <div className="flex justify-between">
      <span className="text-[10px] text-muted-foreground">{left}</span>
      <span className="text-[10px] text-muted-foreground">{right}</span>
    </div>
  </div>
);

const FantasyCharacterModal = ({ character, open, onOpenChange, onStartChat }: FantasyCharacterModalProps) => {
  if (!character) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border/50 rounded-2xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {character.scenario_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Identity */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-violet/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{character.first_name}</p>
                <p className="text-sm text-muted-foreground">{character.age} ans</p>
              </div>
              {character.recommended && (
                <span className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-primary to-pink-500 text-primary-foreground">
                  Recommandé
                </span>
              )}
            </div>
          </div>

          {/* Encounter preview */}
          <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-violet/10 border border-primary/20">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Notre rencontre
            </h3>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              "{character.encounter_preview}"
            </p>
          </div>

          {/* Personality tags */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Personnalité</h3>
            <div className="flex flex-wrap gap-2">
              {character.personality_tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Dynamique</h3>
            <div className="space-y-4 p-4 rounded-2xl bg-muted/20 border border-border/30">
              {SLIDER_CONFIG.map((s) => (
                <SliderBar
                  key={s.key}
                  value={character[s.key]}
                  label={s.label}
                  left={s.left}
                  right={s.right}
                />
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-2 space-y-3">
            <Button
              onClick={onStartChat}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 rounded-full shadow-[0_0_30px_rgba(255,77,141,0.3)] hover:shadow-[0_0_50px_rgba(255,77,141,0.5)] transition-all"
            >
              Commencer la conversation
            </Button>

            <button
              onClick={onStartChat}
              className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {character.starter_cta}
            </button>

            <p className="text-center text-[11px] text-muted-foreground pt-1">
              Les interactions évoluent au fil de la discussion.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FantasyCharacterModal;
