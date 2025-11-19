import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Briefcase, Users, Heart, Sparkles, Star, Crown, UserRound, BadgeCheck, Stethoscope, ClipboardList, Search, X, Lock, Camera, Video, ThumbsUp, ThumbsDown, Flame, Zap, ChevronRight } from "lucide-react";
import { getRandomAvatar } from "@/utils/avatars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import BottomNav from "@/components/BottomNav";
import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/hooks/use-toast";

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  detailedDescription: string;
  photos: number;
  videos: number;
  likes: number;
  dislikes: number;
}

const Scenarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createConversation } = useConversations();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "general" | "favorites">("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteScenarios");
    return saved ? JSON.parse(saved) : [];
  });

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

  const toggleFavorite = (e: React.MouseEvent, scenarioId: string) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(scenarioId)
      ? favorites.filter((id) => id !== scenarioId)
      : [...favorites, scenarioId];
    setFavorites(newFavorites);
    localStorage.setItem("favoriteScenarios", JSON.stringify(newFavorites));
  };

  const isFavorite = (scenarioId: string) => {
    return favorites.includes(scenarioId);
  };

  const scenarios: Scenario[] = [
    {
      id: "celebrity",
      title: "Mio Khalifo",
      description: "Collaboration vérifiée",
      detailedDescription: "Une star internationale qui cherche quelqu'un qui la comprend vraiment...",
      photos: 150,
      videos: 25,
      likes: 1250,
      dislikes: 45,
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
      likes: 1580,
      dislikes: 38,
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
      likes: 890,
      dislikes: 52,
      icon: <Users className="w-6 h-6" />,
    },
    {
      id: "stranger",
      title: "Inconnue",
      description: "Rencontre inattendue",
      detailedDescription: "Cette mystérieuse inconnue croisée dans un bar qui n'arrête pas de te sourire...",
      photos: 32,
      videos: 5,
      likes: 720,
      dislikes: 68,
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      id: "ex",
      title: "L'Ex",
      description: "Le passé qui revient",
      detailedDescription: "Ton ex qui revient dans ta vie avec de nouvelles intentions...",
      photos: 60,
      videos: 12,
      likes: 1120,
      dislikes: 95,
      icon: <Heart className="w-6 h-6" />,
    },
    {
      id: "married",
      title: "Femme Mariée",
      description: "Relation interdite",
      detailedDescription: "Une femme mariée qui cherche l'excitation que son couple ne lui offre plus...",
      photos: 38,
      videos: 7,
      likes: 950,
      dislikes: 120,
      icon: <Crown className="w-6 h-6" />,
    },
    {
      id: "boss",
      title: "La Patronne",
      description: "Une supérieure qui aime le pouvoir",
      detailedDescription: "Ta patronne autoritaire qui aime mélanger travail et plaisir...",
      photos: 55,
      videos: 10,
      likes: 1050,
      dislikes: 78,
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      id: "doctor",
      title: "Docteure",
      description: "Consultation privée",
      detailedDescription: "Une docteure qui propose des consultations très... personnalisées...",
      photos: 42,
      videos: 9,
      likes: 840,
      dislikes: 61,
      icon: <Stethoscope className="w-6 h-6" />,
    },
    {
      id: "secretary",
      title: "Secrétaire",
      description: "Assistante dévouée",
      detailedDescription: "Ta secrétaire qui ferait n'importe quoi pour te satisfaire...",
      photos: 48,
      videos: 11,
      likes: 920,
      dislikes: 55,
      icon: <ClipboardList className="w-6 h-6" />,
    },
  ];

  const handleStartChat = async () => {
    if (selectedScenario && userNickname && characterName) {
      try {
        const avatarUrl = getRandomAvatar();
        const preferences = {
          userNickname,
          characterName,
          characterAge,
          characterGender,
          avatarUrl,
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
        };

        // Créer la conversation dans la base de données
        const conversation = await createConversation({
          character_name: characterName,
          character_avatar: avatarUrl,
          scenario_id: selectedScenario.id,
          preferences,
        });

        // Naviguer vers la conversation
        navigate(`/conversations/${conversation.id}`, {
          state: { 
            scenario: selectedScenario.id,
            preferences,
          },
        });
      } catch (error) {
        console.error("Error creating conversation:", error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la conversation",
          variant: "destructive",
        });
      }
    }
  };

  // Filter scenarios based on search and filter
  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "verified") return matchesSearch && (scenario.id === "celebrity" || scenario.id === "celebrity2");
    if (filter === "general") return matchesSearch && scenario.id !== "celebrity" && scenario.id !== "celebrity2";
    if (filter === "favorites") return matchesSearch && isFavorite(scenario.id);
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-16 items-center px-6">
          <h1 className="text-xl font-semibold text-foreground">Home</h1>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="p-4 space-y-3 border-b border-border bg-card/30">
        {/* Top Tendances Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Left: Top des scénarios populaires */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary animate-pulse" />
              <h2 className="text-lg font-bold text-foreground">Tops du moment</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { title: "Crush secret", emoji: "💕" },
                { title: "Collègue ambiguë", emoji: "👔" },
                { title: "Rencontre inattendue", emoji: "✨" },
                { title: "Ex qui revient", emoji: "💔" },
                { title: "Voisine séduisante", emoji: "🏠" },
              ].map((item, index) => (
                <button
                  key={index}
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 hover:border-primary/50 transition-all hover:scale-105"
                >
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">
                    {item.emoji} {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Expérience exclusive */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-amber-700/5 border-2 border-amber-400/30 p-4 hover:border-amber-400/50 transition-all cursor-pointer group">
            <div className="absolute top-2 right-2">
              <div className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Crown className="w-3 h-3" />
                VIP
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-lg font-bold text-foreground">Expérience exclusive</h3>
              </div>
              <p className="text-sm text-muted-foreground">Disponible encore 24h</p>
              <p className="text-xs text-amber-400 font-medium">Contenu premium • Accès limité</p>
            </div>
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5 text-amber-400" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        </div>

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
          <Button
            size="sm"
            variant={filter === "favorites" ? "default" : "outline"}
            onClick={() => setFilter("favorites")}
            className="flex-1"
          >
            <Heart className="w-3 h-3 mr-1" />
            Favoris
          </Button>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredScenarios.map((scenario, index) => {
            const isUnlocked = isScenarioUnlocked(scenario.id);
            const shouldShowLock = !isAuthenticated && !isUnlocked;
            const isClickable = isAuthenticated || isUnlocked;
            
            return (
              <div
                key={scenario.id}
                className="relative aspect-square rounded-2xl animate-fade-in group [perspective:1000px] hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => handleScenarioClick(scenario)}
                  disabled={!isClickable}
                  className={`relative w-full h-full [transform-style:preserve-3d] transition-all duration-500 group-hover:[transform:rotateY(180deg)] ${!isClickable ? "cursor-not-allowed" : ""}`}
                >
                  {/* Front Face */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-card via-card to-secondary/50 border border-border p-4 flex flex-col items-center justify-center gap-3 [backface-visibility:hidden] shadow-lg hover:shadow-primary/20 transition-shadow ${!isClickable ? "opacity-50" : ""}`}>
                    {shouldShowLock ? (
                      <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm p-2 rounded-xl z-10 shadow-md">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ) : (
                      <button
                        onClick={(e) => toggleFavorite(e, scenario.id)}
                        className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm p-2 rounded-xl z-10 hover:bg-background transition-colors shadow-md"
                      >
                        <Heart 
                          className={`w-4 h-4 ${isFavorite(scenario.id) ? "fill-primary text-primary" : "text-primary"}`}
                        />
                      </button>
                    )}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary shadow-lg">
                      {scenario.icon}
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-foreground text-base mb-1">{scenario.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{scenario.description}</p>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-2 border-primary/30 p-4 flex flex-col items-center justify-center gap-3 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl">
                    {!shouldShowLock && (
                      <button
                        onClick={(e) => toggleFavorite(e, scenario.id)}
                        className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm p-2 rounded-xl z-10 hover:bg-background transition-colors shadow-md"
                      >
                        <Heart 
                          className={`w-4 h-4 ${isFavorite(scenario.id) ? "fill-primary text-primary" : "text-primary"}`}
                        />
                      </button>
                    )}
                    <div className="text-center space-y-3">
                      <p className="text-sm text-foreground leading-relaxed font-bold">
                        {scenario.detailedDescription}
                      </p>
                      <div className="space-y-2 pt-2">
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 font-semibold">
                          <Camera className="w-5 h-5 text-primary" />
                          {scenario.photos} photos
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 font-semibold">
                          <Video className="w-5 h-5 text-primary" />
                          {scenario.videos} vidéos
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-5 h-5 text-primary" />
                          <span className="text-sm font-bold">{scenario.likes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="w-5 h-5 text-primary" />
                          <span className="text-sm font-bold">{scenario.dislikes}</span>
                        </div>
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
                    <Label htmlFor="characterGender" className="text-foreground">Sexe du personnage</Label>
                    <Select value={characterGender} onValueChange={setCharacterGender}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Sélectionnez le sexe" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="homme">Homme</SelectItem>
                        <SelectItem value="femme">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="characterName" className="text-foreground">Nom du personnage</Label>
                    <div className="flex gap-2">
                      <Input
                        id="characterName"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        placeholder="Ex: Sophie"
                        className="bg-secondary border-border flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const maleNames = ["Lucas", "Thomas", "Hugo", "Théo", "Louis", "Raphaël", "Arthur", "Alexandre", "Antoine", "Maxime", "Nathan", "Julien", "Pierre", "Paul", "Marc", "Nicolas", "Vincent", "David", "Sébastien", "Guillaume"];
                          const femaleNames = ["Emma", "Léa", "Chloé", "Manon", "Camille", "Sarah", "Marie", "Laura", "Julie", "Sophie", "Clara", "Lucie", "Charlotte", "Alice", "Inès", "Jade", "Lisa", "Océane", "Eva", "Nina"];
                          
                          const names = characterGender === "homme" ? maleNames : femaleNames;
                          const randomName = names[Math.floor(Math.random() * names.length)];
                          setCharacterName(randomName);
                        }}
                        className="border-border hover:bg-secondary/50 whitespace-nowrap"
                      >
                        Aléatoire
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="characterAge" className="text-foreground">Âge du personnage</Label>
                    <Select value={characterAge} onValueChange={setCharacterAge}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Sélectionnez un âge (18+)" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-60">
                        {Array.from({ length: 82 }, (_, i) => i + 18).map((age) => (
                          <SelectItem key={age} value={age.toString()}>
                            {age} ans
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
