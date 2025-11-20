import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Briefcase, Users, Heart, Sparkles, Star, Crown, UserRound, BadgeCheck, Stethoscope, ClipboardList, Search, X, Lock, Camera, Video, ThumbsUp, ThumbsDown, Flame, Zap, ChevronRight, Dumbbell, GraduationCap, Shield, BookOpen } from "lucide-react";
import { getRandomAvatar } from "@/utils/avatars";
import exclusiveModel from "@/assets/exclusive-model.png";
import colleagueBg from "@/assets/colleague-bg.png";
import colleagueCard from "@/assets/colleague-card.png";
import marriedCard from "@/assets/married-card.png";
import universityCard from "@/assets/university-card.png";
import policeCard from "@/assets/police-card.png";
import teacherCard from "@/assets/teacher-card.png";
import secretaryCard from "@/assets/secretary-card.png";
import doctorCard from "@/assets/doctor-card.png";
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
import CountdownTimer from "@/components/CountdownTimer";
import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/hooks/use-toast";

interface Scenario {
  id: string;
  title: string;
  description: string;
  emotionalSubtitle: string;
  icon: React.ReactNode;
  detailedDescription: string;
  photos: number;
  videos: number;
  likes: number;
  dislikes: number;
  badge?: string;
  gradient: string;
  avatar?: string;
  image?: string; // Background image for card front
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
      emotionalSubtitle: "Célébrité accessible",
      detailedDescription: "Une star internationale qui cherche quelqu'un qui la comprend vraiment...",
      photos: 150,
      videos: 25,
      likes: 1250,
      dislikes: 45,
      badge: "🔥 Top 1 aujourd'hui",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20", // Rose → Violet (Vérifiées)
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
      emotionalSubtitle: "Influenceuse intime",
      detailedDescription: "Une influenceuse qui partage ses moments les plus intimes avec toi...",
      photos: 200,
      videos: 30,
      likes: 1580,
      dislikes: 38,
      badge: "💬 Très populaire",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20", // Rose → Violet (Vérifiées)
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
      emotionalSubtitle: "Jeux de regards complices",
      detailedDescription: "Cette collègue qui te regarde différemment depuis la dernière réunion...",
      photos: 45,
      videos: 8,
      likes: 890,
      dislikes: 52,
      badge: "⭐ Tendance",
      gradient: "from-red-700/25 via-orange-500/15 to-amber-500/20", // Bordeaux → Orangé (Tendance)
      icon: <Users className="w-6 h-6" />,
      image: colleagueCard,
    },
    {
      id: "stranger",
      title: "Inconnue",
      description: "Rencontre inattendue",
      emotionalSubtitle: "Magnétisme instantané",
      detailedDescription: "Cette mystérieuse inconnue croisée dans un bar qui n'arrête pas de te sourire...",
      photos: 32,
      videos: 5,
      likes: 720,
      dislikes: 68,
      badge: "✨ Premium",
      gradient: "from-blue-900/25 via-indigo-600/15 to-purple-500/20", // Bleu foncé → Violet (Mystère)
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      id: "ex",
      title: "L'Ex",
      description: "Le passé qui revient",
      emotionalSubtitle: "Ambiguïté retrouvée",
      detailedDescription: "Ton ex qui revient dans ta vie avec de nouvelles intentions...",
      photos: 60,
      videos: 12,
      likes: 1120,
      dislikes: 95,
      badge: "💬 Très populaire",
      gradient: "from-red-700/25 via-orange-500/15 to-amber-500/20", // Bordeaux → Orangé (Tendance)
      icon: <Heart className="w-6 h-6" />,
    },
    {
      id: "married",
      title: "Femme Mariée",
      description: "Relation interdite",
      emotionalSubtitle: "Passion clandestine",
      detailedDescription: "Une femme mariée qui cherche l'excitation que son couple ne lui offre plus...",
      photos: 38,
      videos: 7,
      likes: 950,
      dislikes: 120,
      badge: "🎭 Rôle dramatique",
      gradient: "from-red-700/25 via-orange-500/15 to-amber-500/20", // Bordeaux → Orangé (Tendance)
      icon: <Crown className="w-6 h-6" />,
      image: marriedCard,
    },
    {
      id: "boss",
      title: "La Patronne",
      description: "Une supérieure qui aime le pouvoir",
      emotionalSubtitle: "Autorité séduisante",
      detailedDescription: "Ta patronne autoritaire qui aime mélanger travail et plaisir...",
      photos: 55,
      videos: 10,
      likes: 1050,
      dislikes: 78,
      badge: "🔥 Top 3 aujourd'hui",
      gradient: "from-red-700/25 via-orange-500/15 to-amber-500/20", // Bordeaux → Orangé (Tendance)
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      id: "doctor",
      title: "Docteure",
      description: "Consultation privée",
      emotionalSubtitle: "Soins personnalisés",
      detailedDescription: "Une docteure qui propose des consultations très... personnalisées...",
      photos: 42,
      videos: 9,
      likes: 840,
      dislikes: 61,
      badge: "⭐ Tendance",
      gradient: "from-blue-900/25 via-indigo-600/15 to-purple-500/20", // Bleu foncé → Violet (Mystère)
      icon: <Stethoscope className="w-6 h-6" />,
      image: doctorCard,
    },
    {
      id: "secretary",
      title: "Secrétaire",
      description: "Assistante dévouée",
      emotionalSubtitle: "Dévouement absolu",
      detailedDescription: "Ta secrétaire qui ferait n'importe quoi pour te satisfaire...",
      photos: 48,
      videos: 11,
      likes: 920,
      dislikes: 55,
      badge: "🕒 Nouveau",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20", // Rose → Violet (Vérifiées)
      icon: <ClipboardList className="w-6 h-6" />,
      image: secretaryCard,
    },
    {
      id: "fitgirl",
      title: "La Fit Girl",
      description: "Énergie et sensualité",
      emotionalSubtitle: "Corps sculpté, esprit libre",
      detailedDescription: "Cette sportive passionnée qui aime repousser ses limites... et les tiennes.",
      photos: 65,
      videos: 14,
      likes: 1180,
      dislikes: 42,
      badge: "🔥 Très populaire",
      gradient: "from-red-700/25 via-orange-500/15 to-amber-500/20", // Bordeaux → Orangé (Tendance)
      icon: <Dumbbell className="w-6 h-6" />,
    },
    {
      id: "university",
      title: "Universitaire",
      description: "Étudiante coquine",
      emotionalSubtitle: "Innocence trompeuse",
      detailedDescription: "Cette étudiante rebelle qui aime jouer avec les limites entre cours et plaisir...",
      photos: 48,
      videos: 9,
      likes: 1050,
      dislikes: 47,
      badge: "🎓 Nouveau",
      gradient: "from-pink-600/25 via-rose-400/15 to-red-400/20", // Rose → Rouge (Jeunesse)
      icon: <GraduationCap className="w-6 h-6" />,
      image: universityCard,
    },
    {
      id: "police",
      title: "Policière",
      description: "Autorité séduisante",
      emotionalSubtitle: "Loi et désir",
      detailedDescription: "Cette officière qui sait faire respecter l'ordre... à sa manière.",
      photos: 52,
      videos: 10,
      likes: 1120,
      dislikes: 58,
      badge: "🚨 Tendance",
      gradient: "from-blue-900/25 via-indigo-600/15 to-purple-500/20", // Bleu foncé → Violet
      icon: <Shield className="w-6 h-6" />,
      image: policeCard,
    },
    {
      id: "teacher",
      title: "Professeure",
      description: "Enseignement privé",
      emotionalSubtitle: "Leçons particulières",
      detailedDescription: "Cette enseignante qui propose des cours privés très... instructifs.",
      photos: 46,
      videos: 8,
      likes: 980,
      dislikes: 51,
      badge: "📚 Nouveau",
      gradient: "from-amber-600/25 via-orange-400/15 to-yellow-400/20", // Ambré → Jaune
      icon: <BookOpen className="w-6 h-6" />,
      image: teacherCard,
    },
    {
      id: "celebrity3",
      title: "Bonnio Blue",
      description: "Collaboration vérifiée",
      emotionalSubtitle: "Charme mystérieux",
      detailedDescription: "Une créatrice de contenu qui aime partager ses secrets les plus intimes...",
      photos: 180,
      videos: 28,
      likes: 1320,
      dislikes: 42,
      badge: "🔥 Top 3 aujourd'hui",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20", // Rose → Violet (Vérifiées)
      icon: (
        <div className="relative">
          <UserRound className="w-6 h-6" />
          <BadgeCheck className="w-3 h-3 text-blue-500 absolute -bottom-0.5 -right-0.5 fill-blue-500" />
        </div>
      ),
    },
    {
      id: "celebrity4",
      title: "Sophie Raino",
      description: "Collaboration vérifiée",
      emotionalSubtitle: "Élégance sensuelle",
      detailedDescription: "Une personnalité captivante qui sait exactement comment te séduire...",
      photos: 165,
      videos: 22,
      likes: 1180,
      dislikes: 35,
      badge: "💬 Très populaire",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20", // Rose → Violet (Vérifiées)
      icon: (
        <div className="relative">
          <UserRound className="w-6 h-6" />
          <BadgeCheck className="w-3 h-3 text-blue-500 absolute -bottom-0.5 -right-0.5 fill-blue-500" />
        </div>
      ),
    },
    {
      id: "celebrity5",
      title: "Bella Thorno",
      description: "Collaboration vérifiée",
      emotionalSubtitle: "Audace assumée",
      detailedDescription: "Une star audacieuse qui n'a peur de rien et qui aime provoquer...",
      photos: 195,
      videos: 32,
      likes: 1420,
      dislikes: 48,
      badge: "✨ Premium",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20", // Rose → Violet (Vérifiées)
      icon: (
        <div className="relative">
          <UserRound className="w-6 h-6" />
          <BadgeCheck className="w-3 h-3 text-blue-500 absolute -bottom-0.5 -right-0.5 fill-blue-500" />
        </div>
      ),
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

  // Filter scenarios based on search and filter
  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "verified") return matchesSearch && (scenario.id === "celebrity" || scenario.id === "celebrity2" || scenario.id === "celebrity3" || scenario.id === "celebrity4" || scenario.id === "celebrity5");
    if (filter === "general") return matchesSearch && !scenario.id.startsWith("celebrity");
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary animate-pulse" />
              <div>
                <h2 className="text-lg font-bold text-foreground">Tops du moment</h2>
                <p className="text-[10px] text-muted-foreground">Découvre les scénarios les plus appréciés aujourd'hui</p>
              </div>
            </div>
            
            {/* Two columns for tops */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left column: Top Vérifiées */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-primary flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Top Vérifiées
                </h3>
                <div className="space-y-1">
                  {[
                    { rank: 1, name: "Mio Khalifo", icon: <div className="relative"><UserRound className="w-4 h-4" /><BadgeCheck className="w-2 h-2 text-blue-500 absolute -bottom-0.5 -right-0.5 fill-blue-500" /></div> },
                    { rank: 2, name: "Korinna Kopfa", icon: <div className="relative"><UserRound className="w-4 h-4" /><BadgeCheck className="w-2 h-2 text-blue-500 absolute -bottom-0.5 -right-0.5 fill-blue-500" /></div> },
                    { rank: 3, name: "Bonnio Blue", icon: <div className="relative"><UserRound className="w-4 h-4" /><BadgeCheck className="w-2 h-2 text-blue-500 absolute -bottom-0.5 -right-0.5 fill-blue-500" /></div> },
                    { rank: 4, name: "Sophie Raino", icon: <div className="relative"><UserRound className="w-4 h-4" /><BadgeCheck className="w-2 h-2 text-blue-500 absolute -bottom-0.5 -right-0.5 fill-blue-500" /></div> },
                    { rank: 5, name: "Bella Thorno", icon: <div className="relative"><UserRound className="w-4 h-4" /><BadgeCheck className="w-2 h-2 text-blue-500 absolute -bottom-0.5 -right-0.5 fill-blue-500" /></div> },
                  ].map((item) => (
                    <div
                      key={item.rank}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500/15 via-pink-400/10 to-rose-600/10 border border-primary/20 hover:border-primary/40 transition-all hover:scale-105 cursor-pointer shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-md"
                    >
                      <span className="text-xs font-bold text-primary w-3">{item.rank}</span>
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-xs font-medium text-foreground truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column: Top Situations */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-accent flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  Top Situations
                </h3>
                <div className="space-y-1">
                  {[
                    { rank: 1, name: "Collègue ambiguë", icon: <Users className="w-4 h-4" /> },
                    { rank: 2, name: "Ex qui revient", icon: <Heart className="w-4 h-4" /> },
                    { rank: 3, name: "Inconnue séduisante", icon: <Sparkles className="w-4 h-4" /> },
                    { rank: 4, name: "La Patronne", icon: <Briefcase className="w-4 h-4" /> },
                    { rank: 5, name: "Docteure", icon: <Stethoscope className="w-4 h-4" /> },
                  ].map((item) => (
                    <div
                      key={item.rank}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500/15 via-pink-400/10 to-rose-600/10 border border-accent/20 hover:border-accent/40 transition-all hover:scale-105 cursor-pointer shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-md"
                    >
                      <span className="text-xs font-bold text-accent w-3">{item.rank}</span>
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-xs font-medium text-foreground truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Expérience exclusive */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-amber-700/5 border-2 border-amber-400/30 p-4 hover:border-amber-400/50 transition-all cursor-pointer group hover:scale-105 shadow-[0_8px_30px_rgb(251,191,36,0.15)] hover:shadow-[0_12px_40px_rgb(251,191,36,0.25)]">
            {/* Image de fond positionnée à droite du milieu */}
            <img 
              src={exclusiveModel} 
              alt="Exclusive" 
              className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-auto object-cover opacity-60 drop-shadow-[4px_4px_12px_rgba(0,0,0,0.3)]"
            />
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg animate-pulse">
                <Crown className="w-4 h-4" />
                VIP
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-400 animate-pulse" />
                <h3 className="text-lg font-bold text-foreground">Expérience exclusive</h3>
              </div>
              <CountdownTimer />
              <p className="text-sm text-muted-foreground font-medium">Accès limité – contenu exclusif</p>
              <p className="text-lg font-bold text-foreground mt-2 mb-0 leading-tight">Chat intense avec</p>
              <p className="text-5xl font-bold text-foreground -mt-3">Sophie Raino</p>
            </div>
            <p className="text-xs text-amber-400 font-medium absolute bottom-4 left-0 right-0 text-center z-10">Contenu premium • Ne laisse pas passer</p>
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <ChevronRight className="w-6 h-6 text-amber-400" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-[5]"></div>
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-amber-600/20 to-amber-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Trouve l'ambiance qui t'attire…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-background/50 border-border focus:border-primary transition-all"
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

        {/* Subtle separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-3"></div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="flex-1"
          >
            <Star className="w-3 h-3 mr-1" />
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
            <Sparkles className="w-3 h-3 mr-1" />
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
                className="relative aspect-square rounded-2xl animate-fade-in group [perspective:1000px] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-2xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => handleScenarioClick(scenario)}
                  disabled={!isClickable}
                  className={`relative w-full h-full [transform-style:preserve-3d] transition-all duration-500 group-hover:[transform:rotateY(180deg)] ${!isClickable ? "cursor-not-allowed" : ""}`}
                >
                  {/* Front Face */}
                  <div className={`absolute inset-0 rounded-2xl border border-border [backface-visibility:hidden] shadow-lg hover:shadow-xl transition-shadow ${!isClickable ? "opacity-50" : ""} overflow-hidden`}>
                    {/* Background Image with Premium Effects */}
                    {scenario.image ? (
                      <div className="absolute inset-0">
                        {/* Background Image with light blur and premium filters */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${scenario.image})`,
                            filter: 'blur(4px) contrast(1.04) saturate(1.1)',
                          }}
                        />
                        
                        {/* Premium vignette effect */}
                        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/12" />
                        
                        {/* Light grain texture */}
                        <div 
                          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                          style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                          }}
                        />
                        
                        {/* Premium gradient overlay - bottom to top */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(23,0,18,0.25) 50%, rgba(0,0,0,0.05) 100%)',
                          }}
                        />
                        
                        {/* Warm temperature filter */}
                        <div className="absolute inset-0 bg-orange-500/[0.06] mix-blend-overlay" />
                      </div>
                    ) : (
                      /* Fallback gradient if no image */
                      <div className={`absolute inset-0 bg-gradient-to-br ${scenario.gradient}`} />
                    )}
                    
                    {/* Visual background effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Content Layer */}
                    <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-3">
                      {/* Badge à gauche */}
                      {scenario.badge && (
                        <div className="absolute top-2 left-2 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-extrabold text-foreground shadow-[0_0_12px_rgba(255,77,141,0.3),0_2px_4px_rgba(0,0,0,0.2)] z-10 border border-primary/30">
                          {scenario.badge}
                        </div>
                      )}
                      
                      {/* Cœur ou Lock à droite */}
                      {shouldShowLock ? (
                        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded-xl z-10 shadow-md">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ) : (
                        <button
                          onClick={(e) => toggleFavorite(e, scenario.id)}
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded-xl z-10 hover:bg-background transition-colors shadow-md"
                        >
                          <Heart 
                            className={`w-4 h-4 ${isFavorite(scenario.id) ? "fill-primary text-primary" : "text-primary"}`}
                          />
                        </button>
                      )}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-primary shadow-lg z-10 ring-2 ring-primary/20">
                        {scenario.icon}
                      </div>
                      <div className="text-center z-10">
                        <h3 className="font-bold text-white text-base mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{scenario.title}</h3>
                        <p className="text-xs text-primary font-semibold mb-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{scenario.emotionalSubtitle}</p>
                        <p className="text-[10px] text-white/90 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{scenario.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${scenario.gradient} border-2 border-primary/30 p-4 flex flex-col items-center justify-center gap-3 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl overflow-hidden`}>
                    {/* Background avec vignettage et grain */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
                    <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(255,77,141,0.15)]"></div>
                    
                    
                    {/* Silhouette floue pour les autres cartes */}
                    {scenario.id !== "colleague" && (
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-foreground/30 rounded-full blur-[60px]"></div>
                      </div>
                    )}
                    
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
                    
                    <div className="text-center space-y-3 z-10 relative">
                      <p className="text-sm text-foreground leading-relaxed font-bold [text-shadow:0_0_8px_rgba(255,255,255,0.3)]">
                        {scenario.detailedDescription}
                      </p>
                      
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-center gap-3 transition-transform hover:scale-105">
                          <Camera className="w-5 h-5 text-primary stroke-[2.5] drop-shadow-[0_0_4px_rgba(255,77,141,0.4)]" />
                          <span className="text-sm text-muted-foreground font-semibold">{scenario.photos} photos</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 transition-transform hover:scale-105">
                          <Video className="w-5 h-5 text-primary stroke-[2.5] drop-shadow-[0_0_4px_rgba(255,77,141,0.4)]" />
                          <span className="text-sm text-muted-foreground font-semibold">{scenario.videos} vidéos</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center gap-8 pt-2">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-5 h-5 text-primary drop-shadow-[0_0_6px_rgba(255,77,141,0.5)]" />
                          <span className="text-sm font-bold text-foreground">{scenario.likes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="w-5 h-5 text-muted-foreground/70" />
                          <span className="text-sm font-bold text-muted-foreground">{scenario.dislikes}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-yellow-600/90 font-light italic pt-1">
                        Très apprécié cette semaine
                      </p>
                      
                      <p className="text-xs text-primary/75 font-light pt-2 hover:text-primary transition-colors cursor-pointer flex items-center justify-center gap-1">
                        Découvrir le scénario <ChevronRight className="w-3 h-3" />
                      </p>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-background via-background to-primary/5 animate-[fade-in_200ms_ease-out,scale-in_200ms_ease-out] [animation-timing-function:cubic-bezier(0.16,1,0.3,1)]">
          <DialogHeader className="pb-6 pr-32 border-b border-border/50 flex-row items-center justify-between shadow-[inset_0_-2px_8px_rgba(0,0,0,0.1)]">
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                Configurer la conversation
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Personnalise ton expérience pour une immersion totale
              </DialogDescription>
            </div>
            {/* Character image - larger with premium effects */}
            {selectedScenario?.avatar ? (
              <div className="absolute top-4 right-4 animate-[fade-in_250ms_ease-out_80ms_backwards,slide-in-from-top_250ms_ease-out_80ms_backwards]">
                {/* Halo circulaire derrière */}
                <div className="absolute inset-0 w-[120px] h-[120px] rounded-full bg-gradient-to-br from-primary/20 via-purple-500/15 to-transparent blur-xl -z-10" />
                
                {/* Photo avec bordure et glow */}
                <div className="relative w-[120px] h-[120px] rounded-full border-2 border-primary/40 shadow-[0_0_18px_rgba(255,77,141,0.2)] overflow-hidden hover:scale-[1.04] hover:shadow-[0_0_24px_rgba(255,77,141,0.35)] transition-all duration-300 cursor-pointer">
                  <img
                    src={selectedScenario.avatar}
                    alt={selectedScenario.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="absolute top-4 right-4 animate-[fade-in_250ms_ease-out_80ms_backwards,slide-in-from-top_250ms_ease-out_80ms_backwards]">
                {/* Halo circulaire derrière */}
                <div className="absolute inset-0 w-[120px] h-[120px] rounded-full bg-gradient-to-br from-primary/20 via-purple-500/15 to-transparent blur-xl -z-10" />
                
                {/* Placeholder avec icône */}
                <div className="relative w-[120px] h-[120px] rounded-full border-2 border-primary/40 bg-card/80 shadow-[0_0_18px_rgba(255,77,141,0.2)] overflow-hidden flex items-center justify-center hover:scale-[1.04] hover:shadow-[0_0_24px_rgba(255,77,141,0.35)] transition-all duration-300">
                  <svg className="w-12 h-12 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            )}
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-5 scrollbar-custom p-1">
            {/* Informations de base */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="userNickname" className="text-foreground font-medium">Nom par lequel je veux être appelé</Label>
                <Input
                  id="userNickname"
                  value={userNickname}
                  onChange={(e) => setUserNickname(e.target.value)}
                  placeholder="Ex: Marc"
                  className="bg-background/50 border-border"
                />
              </div>

              {selectedScenario?.id !== "celebrity" && selectedScenario?.id !== "celebrity2" && selectedScenario?.id !== "celebrity3" && selectedScenario?.id !== "celebrity4" && selectedScenario?.id !== "celebrity5" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="characterGender" className="text-foreground font-medium">Sexe du personnage</Label>
                    <Select value={characterGender} onValueChange={setCharacterGender}>
                      <SelectTrigger className="bg-background/50 border-border">
                        <SelectValue placeholder="Sélectionnez le sexe" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="homme">Homme</SelectItem>
                        <SelectItem value="femme">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="characterName" className="text-foreground font-medium">Nom du personnage</Label>
                    <div className="flex gap-2">
                      <Input
                        id="characterName"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        placeholder="Ex: Sophie"
                        className="bg-background/50 border-border flex-1"
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
                    <Label htmlFor="characterAge" className="text-foreground font-medium">Âge du personnage</Label>
                    <Select value={characterAge} onValueChange={setCharacterAge}>
                      <SelectTrigger className="bg-background/50 border-border">
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
            </div>

            {/* CARD: Style d'écriture */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 shadow-[0_0_8px_rgba(255,77,141,0.12)] border border-primary/20">
              <h3 className="font-bold text-white mb-5 text-lg">
                ✨ Style d'écriture
              </h3>
              
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label className="text-primary text-sm font-semibold">✏️ Style de messages</Label>
                  <RadioGroup value={shortSuggestive ? "suggestive" : softDetailed ? "detailed" : ""} onValueChange={(val) => {
                    setShortSuggestive(val === "suggestive");
                    setSoftDetailed(val === "detailed");
                  }}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                      <RadioGroupItem value="suggestive" id="msg-suggestive" />
                      <Label htmlFor="msg-suggestive" className="flex-1 cursor-pointer">💕 Court & suggestif</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                      <RadioGroupItem value="detailed" id="msg-detailed" />
                      <Label htmlFor="msg-detailed" className="flex-1 cursor-pointer">✨ Doux & détaillé</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                      <RadioGroupItem value="teasing" id="style-teasing" />
                      <Label htmlFor="style-teasing" className="flex-1 cursor-pointer">😏 Taquin</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                      <RadioGroupItem value="romantic" id="style-romantic" />
                      <Label htmlFor="style-romantic" className="flex-1 cursor-pointer">🌹 Romantique</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                      <RadioGroupItem value="intense" id="style-intense" />
                      <Label htmlFor="style-intense" className="flex-1 cursor-pointer">🔥 Intense</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Sous-section: Emojis */}
                <div className="border-t border-primary/20 pt-4">
                  <Label className="text-primary text-sm font-semibold mb-3 block">🎭 Utilisation des emojis</Label>
                  <RadioGroup value={withEmojis ? "with" : withoutEmojis ? "without" : ""} onValueChange={(val) => {
                    setWithEmojis(val === "with");
                    setWithoutEmojis(val === "without");
                  }}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                      <RadioGroupItem value="with" id="emoji-with" />
                      <Label htmlFor="emoji-with" className="flex-1 cursor-pointer">😄 Avec emojis</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                      <RadioGroupItem value="without" id="emoji-without" />
                      <Label htmlFor="emoji-without" className="flex-1 cursor-pointer">⚫ Sans emojis</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* CARD: Intensité de l'échange */}
            <div className="bg-gradient-to-br from-card/80 to-secondary/40 rounded-2xl p-6 shadow-[0_0_8px_rgba(255,77,141,0.12)] border border-primary/20">
              <h3 className="font-bold text-white mb-2 text-lg">
                🔥 Intensité de l'échange
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Plus le niveau est élevé, plus les échanges peuvent devenir suggestifs.
              </p>
              
              <RadioGroup value={intensity} onValueChange={setIntensity} className="space-y-2">
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                  <RadioGroupItem value="amical" id="int-amical" />
                  <Label htmlFor="int-amical" className="flex-1 cursor-pointer">🙂 Amical</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                  <RadioGroupItem value="doux" id="int-doux" />
                  <Label htmlFor="int-doux" className="flex-1 cursor-pointer">🌙 Doux</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                  <RadioGroupItem value="intime" id="int-intime" />
                  <Label htmlFor="int-intime" className="flex-1 cursor-pointer">💗 Intime</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                  <RadioGroupItem value="audacieux" id="int-audacieux" />
                  <Label htmlFor="int-audacieux" className="flex-1 cursor-pointer">🔥 Audacieux</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                  <RadioGroupItem value="tres-audacieux" id="int-tres-audacieux" />
                  <Label htmlFor="int-tres-audacieux" className="flex-1 cursor-pointer">💋 Très audacieux</Label>
                </div>
              </RadioGroup>
            </div>

            {/* CARD: Rythme de réponse */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 shadow-[0_0_8px_rgba(255,77,141,0.12)] border border-primary/20">
              <h3 className="font-bold text-white mb-5 text-lg">
                ⏳ Rythme de réponse
              </h3>
              
              <RadioGroup value={responseRhythm} onValueChange={setResponseRhythm} className="space-y-2">
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                  <RadioGroupItem value="instant" id="rythm-instant" />
                  <Label htmlFor="rythm-instant" className="flex-1 cursor-pointer">⚡ Instantané (10–30s)</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                  <RadioGroupItem value="quick" id="rythm-quick" />
                  <Label htmlFor="rythm-quick" className="flex-1 cursor-pointer">🚀 Rapide (10s–1min)</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                  <RadioGroupItem value="natural" id="rythm-natural" />
                  <Label htmlFor="rythm-natural" className="flex-1 cursor-pointer">🕒 Naturel (10s–5min)</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background/50 transition-all duration-120 hover:scale-[1.02] has-[:checked]:shadow-[0_0_8px_rgba(255,77,141,0.3)]">
                  <RadioGroupItem value="free" id="rythm-free" />
                  <Label htmlFor="rythm-free" className="flex-1 cursor-pointer">🎭 Libre (messages spontanés)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* CTA Section */}
            <div className="mt-6 space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                ✨ Tu es prêt ? Elle t'attend…
              </p>
              <Button
                onClick={handleStartChat}
                disabled={!userNickname || !characterName}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-6 shadow-[0_0_12px_rgba(255,77,141,0.4)] hover:shadow-[0_0_16px_rgba(255,77,141,0.6)] hover:scale-[1.03] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
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
