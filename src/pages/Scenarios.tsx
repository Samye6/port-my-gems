import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Sparkles, Search, Users, Dumbbell, GraduationCap, Shield, BookOpen } from "lucide-react";
import { getRandomAvatar } from "@/utils/avatars";
import lydiaLogo from "@/assets/lydia-logo.png";
import colleagueCard from "@/assets/colleague-card.png";
import universityCard from "@/assets/university-card.png";
import policeCard from "@/assets/police-card.png";
import teacherCard from "@/assets/teacher-card.png";
import fitgirlCard from "@/assets/fitgirl-card.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import BottomNav from "@/components/BottomNav";
import HeroSection from "@/components/home/HeroSection";
import CharacterCarousel from "@/components/home/CharacterCarousel";
import PremiumBanner from "@/components/home/PremiumBanner";
import SearchBar from "@/components/home/SearchBar";
import FloatingChatButton from "@/components/home/FloatingChatButton";
import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/hooks/use-toast";

interface Scenario {
  id: string;
  title: string;
  description: string;
  emotionalSubtitle: string;
  sexyTagline: string;
  icon: React.ReactNode;
  detailedDescription: string;
  photos: number;
  videos: number;
  likes: number;
  dislikes: number;
  badge?: string;
  badgeType?: "trending" | "premium" | "new" | "verified" | "vip";
  gradient: string;
  avatar?: string;
  image?: string;
  isVerified?: boolean;
  isOnline?: boolean;
}

// Mapping des slugs DB vers les ids internes de l'app (HORS DU COMPOSANT)
const SLUG_MAP: Record<string, string> = {
  'collegue': 'colleague',
  'fit-girl': 'fitgirl',
  'universitaire': 'university',
  'policiere': 'police',
  'professeure': 'teacher',
};

const normalizeSlug = (slug: string): string => {
  return SLUG_MAP[slug] || slug;
};

// Mapping des images par id normalisé (HORS DU COMPOSANT)
const IMAGE_MAP: Record<string, string> = {
  'colleague': colleagueCard,
  'fitgirl': fitgirlCard,
  'university': universityCard,
  'police': policeCard,
  'teacher': teacherCard,
};

const getScenarioImage = (id: string): string | undefined => {
  return IMAGE_MAP[id];
};

// Mapping des icônes par id normalisé (HORS DU COMPOSANT)
const getScenarioIcon = (id: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'colleague': <Users className="w-6 h-6" />,
    'fitgirl': <Dumbbell className="w-6 h-6" />,
    'university': <GraduationCap className="w-6 h-6" />,
    'police': <Shield className="w-6 h-6" />,
    'teacher': <BookOpen className="w-6 h-6" />,
  };
  return iconMap[id] || <Sparkles className="w-6 h-6" />;
};

// Mapping des gradients par id normalisé (HORS DU COMPOSANT)
const getScenarioGradient = (id: string, dbGradient?: string | null): string => {
  if (dbGradient) return dbGradient;
  const gradientMap: Record<string, string> = {
    'colleague': 'from-blue-500/25 via-indigo-500/15 to-purple-500/20',
    'fitgirl': 'from-pink-500/25 via-rose-500/15 to-red-500/20',
    'university': 'from-amber-500/25 via-yellow-500/15 to-orange-500/20',
    'police': 'from-slate-500/25 via-blue-500/15 to-indigo-500/20',
    'teacher': 'from-emerald-500/25 via-teal-500/15 to-cyan-500/20',
  };
  return gradientMap[id] || 'from-primary/25 via-violet/15 to-pink/20';
};

// Données immersives pour le modal (meetingStory, personality, teaser) - HORS DU COMPOSANT
const SCENARIO_IMMERSIVE_DATA: Record<string, { meetingStory: string; personality: string[]; contentHint: string; teaser: string }> = {
  colleague: {
    meetingStory: "On travaille ensemble depuis des mois. Les réunions, les regards, les silences… Ce soir, on est encore seuls au bureau. Et l'ambiance a changé.",
    personality: ["Discrète", "Intelligente", "Provocatrice subtile"],
    contentHint: "Les interactions évoluent au fil de la discussion.",
    teaser: "Je t'attendais… tu viens enfin me parler ? 😉",
  },
  fitgirl: {
    meetingStory: "On s'est croisés à la salle. Tu m'as aidée sur une série… depuis, j'ai remarqué ton regard quand je m'entraîne. Ce soir, j'ai encore de l'énergie à dépenser.",
    personality: ["Énergique", "Directe", "Taquine", "Confiante"],
    contentHint: "Les interactions évoluent au fil de la discussion.",
    teaser: "Tu viens t'entraîner avec moi ? 💪",
  },
  university: {
    meetingStory: "On s'est retrouvés à la bibliothèque. Une question, un sourire, puis des messages tard le soir. Elle aime apprendre… et provoquer.",
    personality: ["Curieuse", "Joueuse", "Maligne"],
    contentHint: "Les interactions évoluent au fil de la discussion.",
    teaser: "J'ai une question pour toi… 📚",
  },
  police: {
    meetingStory: "Elle t'a contrôlé une fois. Depuis, elle te reconnaît. Son ton est ferme… mais son regard en dit long. Elle aime garder le contrôle.",
    personality: ["Autoritaire", "Calme", "Dominante"],
    contentHint: "Les interactions évoluent au fil de la discussion.",
    teaser: "Vous êtes en infraction… 🚔",
  },
  teacher: {
    meetingStory: "Elle t'a toujours trouvé différent. Trop attentif, trop mature. Ce soir, la discussion dérape doucement. Elle hésite… puis sourit.",
    personality: ["Élégante", "Intellectuelle", "Troublée"],
    contentHint: "Les interactions évoluent au fil de la discussion.",
    teaser: "J'ai quelque chose à te dire… 👩‍🏫",
  },
};

const Scenarios = () => {
  console.log("[SCENARIOS PAGE LOADED]");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createConversation } = useConversations();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loadingScenarios, setLoadingScenarios] = useState(true);
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

  // Fetch scenarios from Supabase
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const { data, error } = await supabase
          .from("fantasies")
          .select("slug, title, tagline, description, is_active, sort_order, badge, badge_type, photos, videos, likes, dislikes")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (error) {
          console.error("Error fetching scenarios:", error);
          setLoadingScenarios(false);
          return;
        }

        // Diagnostic logs
        console.log("[FANTASIES FETCH DONE]", {
          count: data?.length ?? 0,
          sample: (data ?? []).slice(0, 5).map(r => ({ slug: r.slug, is_active: r.is_active, tagline: r.tagline }))
        });
        console.log("[SUPABASE URL USED]", import.meta.env.VITE_SUPABASE_URL);

        const mappedScenarios: Scenario[] = (data || []).map((row) => {
          const normalizedId = normalizeSlug(row.slug);
          const immersiveData = SCENARIO_IMMERSIVE_DATA[normalizedId];
          
          return {
            id: normalizedId,
            // IMPORTANT: title, tagline (emotionalSubtitle), description viennent de la DB
            title: row.title,
            emotionalSubtitle: row.tagline ?? "",
            description: row.description ?? "",
            sexyTagline: "",
            detailedDescription: immersiveData?.meetingStory ?? "",
            photos: row.photos ?? 0,
            videos: row.videos ?? 0,
            likes: row.likes ?? 0,
            dislikes: row.dislikes ?? 0,
            badge: row.badge ?? undefined,
            badgeType: (row.badge_type as Scenario["badgeType"]) ?? undefined,
            gradient: getScenarioGradient(normalizedId, row.gradient),
            icon: getScenarioIcon(normalizedId),
            image: getScenarioImage(normalizedId),
            isOnline: true,
          };
        });

        setScenarios(mappedScenarios);
      } catch (err) {
        console.error("Error fetching scenarios:", err);
      } finally {
        setLoadingScenarios(false);
      }
    };

    fetchScenarios();
  }, []);
  
  // Form state - simplifié
  const [userNickname, setUserNickname] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [characterAge, setCharacterAge] = useState("");
  const [characterGender, setCharacterGender] = useState("femme");

  const handleScenarioClick = (scenario: Scenario) => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    setSelectedScenario(scenario);
  };

  const toggleFavorite = (e: React.MouseEvent, scenarioId: string) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(scenarioId)
      ? favorites.filter((id) => id !== scenarioId)
      : [...favorites, scenarioId];
    setFavorites(newFavorites);
    localStorage.setItem("favoriteScenarios", JSON.stringify(newFavorites));
  };

  // Filter for search
  const filteredScenarios = scenarios.filter((scenario) => {
    return scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           scenario.emotionalSubtitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleStartChat = async () => {
    if (selectedScenario && userNickname && characterName) {
      try {
        const avatarUrl = getRandomAvatar();
        const immersiveData = SCENARIO_IMMERSIVE_DATA[selectedScenario.id];
        const preferences = {
          userNickname,
          characterName,
          characterAge,
          characterGender,
          avatarUrl,
          // Personnalité et style définis par le scénario (depuis les constantes)
          personality: immersiveData?.personality || [],
          meetingStory: immersiveData?.meetingStory || "",
          // Rythme naturel par défaut
          responseRhythm: "natural",
        };

        const conversation = await createConversation({
          character_name: characterName,
          character_avatar: avatarUrl,
          scenario_id: selectedScenario.id,
          preferences,
        });

        navigate(`/conversations/${conversation.id}`, {
          state: { 
            scenarioId: selectedScenario.id,
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

  

  const generateRandomName = () => {
    const femaleNames = ["Emma", "Sophie", "Chloé", "Léa", "Manon", "Camille", "Sarah", "Laura", "Julie", "Marie"];
    const maleNames = ["Lucas", "Hugo", "Thomas", "Nathan", "Louis", "Maxime", "Alexandre", "Antoine", "Paul", "Arthur"];
    
    const names = characterGender === "homme" ? maleNames : femaleNames;
    const randomName = names[Math.floor(Math.random() * names.length)];
    setCharacterName(randomName);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
     
      {/* Premium Header */}
      <header className="sticky top-0 z-50 relative">
        {/* Main header container with premium gradient background */}
        <div 
          className="relative backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(11, 11, 13, 0.95) 0%, rgba(88, 28, 135, 0.15) 50%, rgba(219, 39, 119, 0.08) 100%)',
          }}
        >
          {/* Subtle floating glow effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            }}
          />
          
          <div className="container flex h-16 items-center justify-between px-6 relative z-10">
            <div className="flex items-center gap-3">
              {/* Logo with premium glow and hover animation */}
              <div className="relative group cursor-pointer">
                {/* Logo glow background */}
                <div 
                  className="absolute inset-0 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                  style={{
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(139, 92, 246, 0.2) 70%, transparent 100%)',
                    transform: 'scale(1.5)',
                  }}
                />
                <img 
                  src={lydiaLogo} 
                  alt="Lydia" 
                  className="w-10 h-10 object-contain relative z-10 transition-all duration-200 group-hover:scale-105 group-hover:brightness-110"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.3))',
                  }}
                />
              </div>
              
              {/* Title with premium typography */}
              <h1 
                className="text-xl font-bold tracking-wide"
                style={{
                  color: '#FFE6F5',
                  textShadow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(236, 72, 153, 0.15)',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              >
                Lydia
              </h1>
            </div>
            {!isAuthenticated && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/auth")}
                className="rounded-full border-primary/50 text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-105"
                style={{
                  boxShadow: '0 0 15px rgba(236, 72, 153, 0.2)',
                }}
              >
                Se connecter
              </Button>
            )}
          </div>
        </div>
        
        {/* Premium gradient bottom border */}
        <div 
          className="h-[1px] w-full"
          style={{
            background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.6) 50%, rgba(251, 146, 60, 0.4) 100%)',
            boxShadow: '0 1px 8px rgba(236, 72, 153, 0.3)',
          }}
        />
        
        {/* Floating glow under header */}
        <div 
          className="absolute -bottom-4 left-0 right-0 h-8 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          }}
        />
      </header>

      {/* Hero Section */}
      <HeroSection 
        onStartChat={() => {
          if (scenarios[0]) setSelectedScenario(scenarios[0]);
        }}
        isAuthenticated={isAuthenticated}
      />

      {/* Search Section */}
      <section className="container px-6 py-8 -mt-8 relative z-20">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </section>

      {/* Show filtered results if searching */}
      {searchQuery ? (
        <section className="container px-6 py-4">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Résultats pour "{searchQuery}"
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredScenarios.map((scenario) => (
              <div key={scenario.id} className="aspect-[3/4]">
                {/* Simplified card for search results */}
                <div 
                  className="w-full h-full rounded-2xl overflow-hidden cursor-pointer relative group"
                  onClick={() => handleScenarioClick(scenario)}
                >
                  {scenario.image ? (
                    <img src={scenario.image} alt={scenario.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${scenario.gradient}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white">{scenario.title}</h3>
                    <p className="text-sm text-primary">{scenario.emotionalSubtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : loadingScenarios ? (
        <section className="container px-6 py-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Chargement…</p>
          </div>
        </section>
      ) : scenarios.length === 0 ? (
        <section className="container px-6 py-12 text-center">
          <p className="text-muted-foreground">Aucun scénario disponible</p>
        </section>
      ) : (
        <>
          {/* PHASE DE LANCEMENT : Tous les scénarios Fantasy disponibles */}
          <CharacterCarousel
            title="Fantasy"
            subtitle="Scénarios immersifs disponibles"
            icon={<Sparkles className="w-6 h-6" />}
            characters={scenarios}
            isAuthenticated={isAuthenticated}
            favorites={favorites}
            onCharacterClick={handleScenarioClick}
            onFavoriteToggle={toggleFavorite}
            cardSize="large"
          />

          {/* Premium Banner */}
          <PremiumBanner />

          {/* Sections supplémentaires retirées pour simplifier le parcours */}

          {/* PHASE DE LANCEMENT : Section "Tous les personnages" retirée - seuls les 5 Fantasy sont visibles */}
        </>
      )}

      {/* Floating Chat Button */}
      <FloatingChatButton 
        onClick={() => {
          if (isAuthenticated && scenarios[0]) {
            setSelectedScenario(scenarios[0]);
          } else {
            navigate("/auth");
          }
        }}
      />

      {/* Configuration Dialog - Refonte immersive */}
      <Dialog open={selectedScenario !== null} onOpenChange={(open) => !open && setSelectedScenario(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-violet/30 flex items-center justify-center text-primary">
                {selectedScenario?.icon}
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {selectedScenario?.title}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Section immersive "Notre rencontre" */}
            <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-violet/10 border border-primary/20">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Notre rencontre
              </h3>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "{selectedScenario && SCENARIO_IMMERSIVE_DATA[selectedScenario.id]?.meetingStory}"
              </p>
            </div>

            {/* Section Personnalité */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Personnalité</h3>
              <div className="flex flex-wrap gap-2">
                {selectedScenario && SCENARIO_IMMERSIVE_DATA[selectedScenario.id]?.personality.map((trait, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Section "Ce que tu vas vivre" */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {selectedScenario && SCENARIO_IMMERSIVE_DATA[selectedScenario.id]?.contentHint}
              </p>
            </div>

            {/* Champs utilisateur simplifiés */}
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="userNickname" className="text-foreground font-semibold">
                  Ton prénom ou pseudo
                </Label>
                <Input
                  id="userNickname"
                  value={userNickname}
                  onChange={(e) => setUserNickname(e.target.value)}
                  placeholder="Comment veux-tu être appelé ?"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="characterName" className="text-foreground font-semibold">
                  Prénom du personnage
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="characterName"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="Prénom..."
                    className="bg-background border-border flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomName}
                    className="whitespace-nowrap"
                  >
                    🎲 Aléatoire
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Âge du personnage</Label>
                <Select value={characterAge} onValueChange={setCharacterAge}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Choisir un âge..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 43 }, (_, i) => i + 18).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age} ans
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Teaser avant CTA */}
            <div className="pt-4 space-y-4">
              <div className="text-center p-3 rounded-xl bg-gradient-to-r from-primary/10 to-violet/10 border border-primary/20">
                <p className="text-sm text-primary italic">
                  "{selectedScenario && SCENARIO_IMMERSIVE_DATA[selectedScenario.id]?.teaser}"
                </p>
              </div>
              
              <p className="text-center text-xs text-muted-foreground">
                Quand tu veux.
              </p>
              
              <Button
                onClick={handleStartChat}
                disabled={!userNickname || !characterName}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 rounded-full shadow-[0_0_30px_rgba(255,77,141,0.3)] hover:shadow-[0_0_50px_rgba(255,77,141,0.5)] transition-all"
              >
                Commencer la conversation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Scenarios;
