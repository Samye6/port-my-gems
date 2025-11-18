import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Briefcase, Users, Heart, Sparkles, Star, Crown, UserRound, BadgeCheck, Stethoscope, ClipboardList, Search, X, Lock } from "lucide-react";
import { getRandomAvatar } from "@/utils/avatars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  detailedDescription: string;
  photos: number;
  videos: number;
}

const Scenarios = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "general">("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  // Form state
  const [userNickname, setUserNickname] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [characterAge, setCharacterAge] = useState("");
  const [characterGender, setCharacterGender] = useState("");
  const [shortSuggestive, setShortSuggestive] = useState(false);
  const [softDetailed, setSoftDetailed] = useState(false);
  const [teasingTone, setTeasingTone] = useState(false);
  const [romanticTone, setRomanticTone] = useState(false);
  const [intenseTone, setIntenseTone] = useState(false);
  const [withEmojis, setWithEmojis] = useState(false);
  const [withoutEmojis, setWithoutEmojis] = useState(false);
  const [intensity, setIntensity] = useState("doux");
  const [responseRhythm, setResponseRhythm] = useState("natural");

  const handleScenarioClick = (scenario: Scenario) => {
    if (!isAuthenticated) {
      // Scénarios accessibles pour les visiteurs qui redirigent vers la connexion
      if (scenario.id === "colleague" || scenario.id === "doctor") {
        navigate("/auth");
        return;
      }
      // Autres scénarios verrouillés
      return;
    }
    // Utilisateur authentifié - ouvrir le dialog de configuration
    setSelectedScenario(scenario);
  };

  const isScenarioUnlocked = (scenarioId: string) => {
    return scenarioId === "colleague" || scenarioId === "doctor";
  };

  const scenarios: Scenario[] = [
    {
      id: "celebrity",
      title: "Mio Khalifo",
      description: "Collaboration vérifiée",
      detailedDescription: "Une star internationale qui cherche quelqu'un qui la comprend vraiment...",
      photos: 150,
      videos: 25,
      icon: (
        <div className="relative">
          <UserRound className="w-6 h-6" />
          <BadgeCheck className="w-3 h-3 text-blue-500 absolute -bottom-0.5 -right-0.5 fill-blue-500" />
        </div>
      ),
    },
    {
      id: "celebrity2",
      title: "Korinna Kopfa",
      description: "Collaboration vérifiée",
      detailedDescription: "Une influenceuse qui partage ses moments les plus intimes avec toi...",
      photos: 200,
      videos: 30,
      icon: (
        <div className="relative">
          <UserRound className="w-6 h-6" />
          <BadgeCheck className="w-3 h-3 text-blue-500 absolute -bottom-0.5 -right-0.5 fill-blue-500" />
        </div>
      ),
    },
    {
      id: "colleague",
      title: "Collègue",
      description: "Tension au bureau",
      detailedDescription: "Cette collègue qui te regarde différemment depuis la dernière réunion...",
      photos: 45,
      videos: 8,
      icon: <Users className="w-6 h-6" />,
    },
    {
      id: "stranger",
      title: "Inconnue",
      description: "Rencontre inattendue",
      detailedDescription: "Cette mystérieuse inconnue croisée dans un bar qui n'arrête pas de te sourire...",
      photos: 32,
      videos: 5,
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      id: "ex",
      title: "L'Ex",
      description: "Le passé qui revient",
      detailedDescription: "Ton ex qui revient dans ta vie avec de nouvelles intentions...",
      photos: 60,
      videos: 12,
      icon: <Heart className="w-6 h-6" />,
    },
    {
      id: "married",
      title: "Femme Mariée",
      description: "Relation interdite",
      detailedDescription: "Une femme mariée qui cherche l'excitation que son couple ne lui offre plus...",
      photos: 38,
      videos: 7,
      icon: <Crown className="w-6 h-6" />,
    },
    {
      id: "boss",
      title: "La Patronne",
      description: "Une supérieure qui aime le pouvoir",
      detailedDescription: "Ta patronne autoritaire qui aime mélanger travail et plaisir...",
      photos: 55,
      videos: 10,
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      id: "doctor",
      title: "Docteure",
      description: "Consultation privée",
      detailedDescription: "Une docteure qui propose des consultations très... personnalisées...",
      photos: 42,
      videos: 9,
      icon: <Stethoscope className="w-6 h-6" />,
    },
    {
      id: "secretary",
      title: "Secrétaire",
      description: "Assistante dévouée",
      detailedDescription: "Ta secrétaire qui ferait n'importe quoi pour te satisfaire...",
      photos: 48,
      videos: 11,
      icon: <ClipboardList className="w-6 h-6" />,
    },
  ];

  const handleStartChat = () => {
    if (selectedScenario && userNickname && characterName) {
      navigate("/chat/new", {
        state: { 
          scenario: selectedScenario.id,
          preferences: {
            userNickname,
            characterName,
            characterAge,
            characterGender,
            avatarUrl: getRandomAvatar(),
            writingStyle: {
              shortSuggestive,
              softDetailed,
              teasingTone,
              romanticTone,
              intenseTone,
              withEmojis,
              withoutEmojis,
            },
            intensity,
            responseRhythm,
          }
        },
      });
    }
  };

  // Filter scenarios based on search and filter
  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "verified") return matchesSearch && (scenario.id === "celebrity" || scenario.id === "celebrity2");
    if (filter === "general") return matchesSearch && scenario.id !== "celebrity" && scenario.id !== "celebrity2";
    
    return matchesSearch;
  });

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

      {/* Search and Filter Bar */}
      <div className="p-4 space-y-3 border-b border-border bg-card/30">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un scénario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-background border-border"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="flex-1"
          >
            Tous
          </Button>
          <Button
            size="sm"
            variant={filter === "verified" ? "default" : "outline"}
            onClick={() => setFilter("verified")}
            className="flex-1"
          >
            <BadgeCheck className="w-3 h-3 mr-1" />
            Vérifiés
          </Button>
          <Button
            size="sm"
            variant={filter === "general" ? "default" : "outline"}
            onClick={() => setFilter("general")}
            className="flex-1"
          >
            Général
          </Button>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {filteredScenarios.map((scenario, index) => {
            const isUnlocked = isScenarioUnlocked(scenario.id);
            const shouldShowLock = !isAuthenticated && !isUnlocked;
            const isClickable = isAuthenticated || isUnlocked;
            
            return (
              <div
                key={scenario.id}
                className="relative aspect-square rounded-xl animate-fade-in group [perspective:1000px]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => handleScenarioClick(scenario)}
                  disabled={!isClickable}
                  className={`relative w-full h-full [transform-style:preserve-3d] transition-all duration-500 group-hover:[transform:rotateY(180deg)] ${!isClickable ? "cursor-not-allowed" : ""}`}
                >
                  {/* Front Face */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-card to-secondary border border-border p-3 flex flex-col items-center justify-center gap-2 [backface-visibility:hidden] ${!isClickable ? "opacity-50" : ""}`}>
                    {shouldShowLock && (
                      <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm p-1.5 rounded-lg z-10">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      {scenario.icon}
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-foreground text-sm mb-0.5">{scenario.title}</h3>
                      <p className="text-xs text-muted-foreground">{scenario.description}</p>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 p-3 flex flex-col items-center justify-center gap-2 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="text-center space-y-2">
                      <p className="text-xs text-foreground leading-relaxed font-semibold">
                        {scenario.detailedDescription}
                      </p>
                      <div className="space-y-1 pt-2">
                        <p className="text-xs text-muted-foreground">
                          📸 {scenario.photos} photos
                        </p>
                        <p className="text-xs text-muted-foreground">
                          🎬 {scenario.videos} vidéos
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={!!selectedScenario} onOpenChange={() => setSelectedScenario(null)}>
        <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Configurer la conversation</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Personnalisez votre expérience
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Style d'écriture */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Style d'écriture</h3>
              
              <div className="space-y-2">
                <Label htmlFor="userNickname" className="text-foreground">Nom par lequel je veux être appelé</Label>
                <Input
                  id="userNickname"
                  value={userNickname}
                  onChange={(e) => setUserNickname(e.target.value)}
                  placeholder="Ex: Marc"
                  className="bg-secondary border-border"
                />
              </div>

              {selectedScenario?.id !== "celebrity" && selectedScenario?.id !== "celebrity2" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="characterName" className="text-foreground">Nom du personnage</Label>
                    <Input
                      id="characterName"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      placeholder="Ex: Sophie"
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="characterAge" className="text-foreground">Âge du personnage</Label>
                    <Input
                      id="characterAge"
                      value={characterAge}
                      onChange={(e) => setCharacterAge(e.target.value)}
                      placeholder="Ex: 28"
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="characterGender" className="text-foreground">Sexe du personnage</Label>
                    <Input
                      id="characterGender"
                      value={characterGender}
                      onChange={(e) => setCharacterGender(e.target.value)}
                      placeholder="Ex: Femme"
                      className="bg-secondary border-border"
                    />
                  </div>
                </>
              )}

              <div className="space-y-3">
                <Label className="text-foreground">Style de messages</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shortSuggestive"
                      checked={shortSuggestive}
                      onCheckedChange={(checked) => setShortSuggestive(checked as boolean)}
                    />
                    <Label htmlFor="shortSuggestive" className="text-sm text-muted-foreground cursor-pointer">
                      Messages courts et suggestifs
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="softDetailed"
                      checked={softDetailed}
                      onCheckedChange={(checked) => setSoftDetailed(checked as boolean)}
                    />
                    <Label htmlFor="softDetailed" className="text-sm text-muted-foreground cursor-pointer">
                      Messages doux et détaillés
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="teasingTone"
                      checked={teasingTone}
                      onCheckedChange={(checked) => setTeasingTone(checked as boolean)}
                    />
                    <Label htmlFor="teasingTone" className="text-sm text-muted-foreground cursor-pointer">
                      Ton taquin
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="romanticTone"
                      checked={romanticTone}
                      onCheckedChange={(checked) => setRomanticTone(checked as boolean)}
                    />
                    <Label htmlFor="romanticTone" className="text-sm text-muted-foreground cursor-pointer">
                      Ton romantique
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="intenseTone"
                      checked={intenseTone}
                      onCheckedChange={(checked) => setIntenseTone(checked as boolean)}
                    />
                    <Label htmlFor="intenseTone" className="text-sm text-muted-foreground cursor-pointer">
                      Ton intense
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="withEmojis"
                      checked={withEmojis}
                      onCheckedChange={(checked) => setWithEmojis(checked as boolean)}
                    />
                    <Label htmlFor="withEmojis" className="text-sm text-muted-foreground cursor-pointer">
                      Avec emojis
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="withoutEmojis"
                      checked={withoutEmojis}
                      onCheckedChange={(checked) => setWithoutEmojis(checked as boolean)}
                    />
                    <Label htmlFor="withoutEmojis" className="text-sm text-muted-foreground cursor-pointer">
                      Sans emojis
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Intensité de l'échange */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                🔥 Intensité de l'échange
              </h3>
              <p className="text-xs text-muted-foreground">
                Plus le niveau est élevé, plus les échanges peuvent devenir suggestifs dans le ton et l'ambiance.
              </p>
              <RadioGroup value={intensity} onValueChange={setIntensity}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="amical" id="amical" />
                  <Label htmlFor="amical" className="text-sm text-muted-foreground cursor-pointer">Amical</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doux" id="doux" />
                  <Label htmlFor="doux" className="text-sm text-muted-foreground cursor-pointer">Doux</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intime" id="intime" />
                  <Label htmlFor="intime" className="text-sm text-muted-foreground cursor-pointer">Intime</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="audacieux" id="audacieux" />
                  <Label htmlFor="audacieux" className="text-sm text-muted-foreground cursor-pointer">Audacieux</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tres-audacieux" id="tres-audacieux" />
                  <Label htmlFor="tres-audacieux" className="text-sm text-muted-foreground cursor-pointer">Très audacieux</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Rythme de réponse */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                ⏳ Rythme de réponse
              </h3>
              <RadioGroup value={responseRhythm} onValueChange={setResponseRhythm}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="instant" id="instant" />
                  <Label htmlFor="instant" className="text-sm text-muted-foreground cursor-pointer">
                    Réponse instantanée (10s-30s)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quick" id="quick" />
                  <Label htmlFor="quick" className="text-sm text-muted-foreground cursor-pointer">
                    Réponse rapide (10s-1min)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="natural" id="natural" />
                  <Label htmlFor="natural" className="text-sm text-muted-foreground cursor-pointer">
                    Réponse naturelle (10s-5min)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="text-sm text-muted-foreground cursor-pointer">
                    Mode libre
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              onClick={handleStartChat}
              disabled={!userNickname || !characterName}
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
