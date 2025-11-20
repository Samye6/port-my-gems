import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConversationSettingsProps {
  conversationId: string;
  onClose: () => void;
  preferences: any;
  onPreferencesUpdate: (newPreferences: any) => void;
}

export const ConversationSettings = ({ 
  conversationId, 
  onClose, 
  preferences,
  onPreferencesUpdate 
}: ConversationSettingsProps) => {
  const { toast } = useToast();
  const [writingStyle, setWritingStyle] = useState(preferences?.writingStyle || "suggestive");
  const [intensity, setIntensity] = useState(preferences?.intensity || 3);
  const [rhythm, setRythm] = useState(preferences?.rhythm || "natural");
  const [tone, setTone] = useState(preferences?.tone || "playful");
  const [useEmojis, setUseEmojis] = useState(preferences?.useEmojis !== false);

  const updatePreferences = async () => {
    const newPreferences = {
      writingStyle,
      intensity,
      rhythm,
      tone,
      useEmojis
    };

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ preferences: newPreferences })
        .eq('id', conversationId);

      if (error) throw error;

      onPreferencesUpdate(newPreferences);
      
      toast({
        title: "Préférences mises à jour",
        description: "Les réglages ont été appliqués à la conversation",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les préférences",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    updatePreferences();
  }, [writingStyle, intensity, rhythm, tone, useEmojis]);

  const intensityLabels = ["Amical", "Doux", "Intime", "Audacieux", "Très audacieux"];

  return (
    <div className="h-full bg-background border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
        <h2 className="text-lg font-semibold">Réglages de conversation</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-custom">
        {/* CARD: Style d'écriture */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-5 shadow-lg border border-primary/10">
          <h3 className="font-bold text-foreground mb-4 text-base flex items-center gap-2">
            ✨ Style d'écriture
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">Style de messages</Label>
              <Select value={writingStyle} onValueChange={setWritingStyle}>
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggestive">💕 Court & suggestif</SelectItem>
                  <SelectItem value="detailed">✨ Doux & détaillé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">Ton de conversation</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="playful">😏 Taquin</SelectItem>
                  <SelectItem value="romantic">🌹 Romantique</SelectItem>
                  <SelectItem value="intense">🔥 Intense</SelectItem>
                  <SelectItem value="flirty">💋 Coquin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sous-section: Emojis */}
            <div className="border-t border-primary/20 pt-4 mt-4">
              <Label className="text-foreground text-sm font-medium mb-2 block">Utilisation des emojis</Label>
              <Select value={useEmojis ? "yes" : "no"} onValueChange={(val) => setUseEmojis(val === "yes")}>
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">😄 Avec emojis</SelectItem>
                  <SelectItem value="no">⚫ Sans emojis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* CARD: Intensité de l'échange */}
        <div className="bg-gradient-to-br from-card/80 to-secondary/40 rounded-2xl p-5 shadow-lg border border-border">
          <h3 className="font-bold text-foreground mb-2 text-base flex items-center gap-2">
            🔥 Intensité de l'échange
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Plus l'intensité est élevée, plus les échanges deviennent suggestifs
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Niveau {intensity}</span>
              <span className="text-sm font-medium text-primary">{intensityLabels[intensity - 1]}</span>
            </div>
            <Slider
              value={[intensity]}
              onValueChange={(vals) => setIntensity(vals[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>🙂</span>
              <span>🌙</span>
              <span>💗</span>
              <span>🔥</span>
              <span>💋</span>
            </div>
          </div>
        </div>

        {/* CARD: Rythme de réponse */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-5 shadow-lg border border-primary/10">
          <h3 className="font-bold text-foreground mb-4 text-base flex items-center gap-2">
            ⏳ Rythme de réponse
          </h3>
          
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Délai de réponse</Label>
            <Select value={rhythm} onValueChange={setRythm}>
              <SelectTrigger className="bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">⚡ Instantané (10s-30s)</SelectItem>
                <SelectItem value="quick">🚀 Rapide (10s-1min)</SelectItem>
                <SelectItem value="natural">🕒 Naturel (10s-5min)</SelectItem>
                <SelectItem value="free">🎭 Libre (messages spontanés)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
