import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Crown, LogOut, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const navigate = useNavigate();
  const [sensuality, setSensuality] = useState([2]);
  const [writingStyle, setWritingStyle] = useState("balanced");

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader />

      <div className="p-4 space-y-6">
        {/* User Info */}
        <Card className="p-6 bg-card border-border animate-fade-in">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Utilisateur</h2>
              <p className="text-sm text-muted-foreground">Compte gratuit</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => navigate("/premium")}
            >
              <Crown className="w-4 h-4 mr-2" />
              Premium
            </Button>
          </div>
        </Card>

        {/* AI Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Préférences IA</h3>
          </div>

          <Card className="p-6 bg-card border-border space-y-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="space-y-3">
              <Label className="text-foreground">Style d'écriture</Label>
              <Select value={writingStyle} onValueChange={setWritingStyle}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="concise">Concis</SelectItem>
                  <SelectItem value="balanced">Équilibré</SelectItem>
                  <SelectItem value="descriptive">Descriptif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-foreground">Niveau de sensualité</Label>
                <span className="text-sm text-primary font-semibold">{sensuality[0]}/3</span>
              </div>
              <Slider
                value={sensuality}
                onValueChange={setSensuality}
                max={3}
                min={0}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Doux</span>
                <span>Sensuel</span>
                <span>Intense</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-foreground">Fréquence de réponse</Label>
              <Select defaultValue="normal">
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="slow">Lente (plus réaliste)</SelectItem>
                  <SelectItem value="normal">Normale</SelectItem>
                  <SelectItem value="fast">Rapide</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-secondary/70"
            onClick={() => navigate("/shop")}
          >
            <Crown className="w-5 h-5 mr-3" />
            Boutique
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-secondary/70"
          >
            <Settings className="w-5 h-5 mr-3" />
            Paramètres
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </Button>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-muted-foreground space-y-1 pt-4">
          <p>Version 1.0.0</p>
          <p>Contenu réservé aux adultes (+18)</p>
          <p>Mentions légales • Confidentialité</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
