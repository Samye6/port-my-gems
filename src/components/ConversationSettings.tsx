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
      <div className="p-4 border-b border-border flex items-center justify-between">
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
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Style de messages */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Style de messages</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Définis comment le personnage s'exprime
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="writing-style">Type de messages</Label>
            <Select value={writingStyle} onValueChange={setWritingStyle}>
              <SelectTrigger id="writing-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suggestive">Messages courts et suggestifs</SelectItem>
                <SelectItem value="detailed">Messages doux et détaillés</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="tone">Ton de la conversation</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="playful">Ton taquin</SelectItem>
                <SelectItem value="romantic">Ton romantique</SelectItem>
                <SelectItem value="intense">Ton intense</SelectItem>
                <SelectItem value="flirty">Ton coquin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="emojis">Utilisation des emojis</Label>
            <Select value={useEmojis ? "yes" : "no"} onValueChange={(val) => setUseEmojis(val === "yes")}>
              <SelectTrigger id="emojis">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Avec emojis</SelectItem>
                <SelectItem value="no">Sans emojis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Intensité de l'échange */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Intensité de l'échange</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Plus l'intensité est élevée, plus les échanges deviennent suggestifs
            </p>
          </div>
          
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
          </div>
        </div>

        {/* Rythme de réponse */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Rythme de réponse</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Contrôle la vitesse et la spontanéité des réponses
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="rhythm">Délai de réponse</Label>
            <Select value={rhythm} onValueChange={setRythm}>
              <SelectTrigger id="rhythm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Réponse instantanée (10s-30s)</SelectItem>
                <SelectItem value="quick">Réponse rapide (10s-1min)</SelectItem>
                <SelectItem value="natural">Réponse naturelle (10s-5min)</SelectItem>
                <SelectItem value="free">Mode libre (messages spontanés)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
