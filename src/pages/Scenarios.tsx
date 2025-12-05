import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Briefcase, Users, Heart, Sparkles, Crown, UserRound, BadgeCheck, 
  Stethoscope, ClipboardList, Search, Lock, Dumbbell, GraduationCap, 
  Shield, BookOpen, Flame, Star, Zap
} from "lucide-react";
import { getRandomAvatar } from "@/utils/avatars";
import lydiaLogo from "@/assets/lydia-logo.png";
import colleagueCard from "@/assets/colleague-card.png";
import marriedCard from "@/assets/married-card.png";
import universityCard from "@/assets/university-card.png";
import policeCard from "@/assets/police-card.png";
import teacherCard from "@/assets/teacher-card.png";
import secretaryCard from "@/assets/secretary-card.png";
import doctorCard from "@/assets/doctor-card.png";
import bossCard from "@/assets/boss-card.png";
import fitgirlCard from "@/assets/fitgirl-card.png";
import unknownCard from "@/assets/unknown-card.png";
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

const Scenarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createConversation } = useConversations();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
      if (scenario.id === "colleague" || scenario.id === "doctor") {
        navigate("/auth");
        return;
      }
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

  // All scenarios data
  const scenarios: Scenario[] = [
    {
      id: "celebrity",
      title: "Mio Khalifo",
      description: "Collaboration vérifiée",
      emotionalSubtitle: "Célébrité accessible",
      sexyTagline: "Viens me parler en privé... 😏",
      detailedDescription: "Une star internationale qui cherche quelqu'un qui la comprend vraiment...",
      photos: 150,
      videos: 25,
      likes: 1250,
      dislikes: 45,
      badge: "Top 1",
      badgeType: "trending",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20",
      isVerified: true,
      isOnline: true,
      icon: <UserRound className="w-6 h-6" />,
    },
    {
      id: "celebrity2",
      title: "Korinna Kopfa",
      description: "Collaboration vérifiée",
      emotionalSubtitle: "Influenceuse intime",
      sexyTagline: "J'ai envie de te connaître... 💋",
      detailedDescription: "Une influenceuse qui partage ses moments les plus intimes avec toi...",
      photos: 200,
      videos: 30,
      likes: 1580,
      dislikes: 38,
      badge: "Populaire",
      badgeType: "verified",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20",
      isVerified: true,
      isOnline: true,
      icon: <UserRound className="w-6 h-6" />,
    },
    {
      id: "colleague",
      title: "Collègue",
      description: "Tension au bureau",
      emotionalSubtitle: "Regards complices",
      sexyTagline: "On se retrouve à la pause ? 😘",
      detailedDescription: "Cette collègue qui te regarde différemment depuis la dernière réunion...",
      photos: 45,
      videos: 8,
      likes: 890,
      dislikes: 52,
      badge: "Tendance",
      badgeType: "trending",
      gradient: "from-red-700/25 via-orange-500/15 to-amber-500/20",
      icon: <Users className="w-6 h-6" />,
      image: colleagueCard,
      isOnline: true,
    },
    {
      id: "stranger",
      title: "Inconnue",
      description: "Rencontre inattendue",
      emotionalSubtitle: "Magnétisme instantané",
      sexyTagline: "Tu me fascines... 🌙",
      detailedDescription: "Cette mystérieuse inconnue croisée dans un bar qui n'arrête pas de te sourire...",
      photos: 32,
      videos: 5,
      likes: 720,
      dislikes: 68,
      badge: "Premium",
      badgeType: "premium",
      gradient: "from-blue-900/25 via-indigo-600/15 to-purple-500/20",
      icon: <Sparkles className="w-6 h-6" />,
      image: unknownCard,
    },
    {
      id: "ex",
      title: "L'Ex",
      description: "Le passé qui revient",
      emotionalSubtitle: "Ambiguïté retrouvée",
      sexyTagline: "On avait quelque chose de spécial... 💔",
      detailedDescription: "Ton ex qui revient dans ta vie avec de nouvelles intentions...",
      photos: 60,
      videos: 12,
      likes: 1120,
      dislikes: 95,
      badge: "Populaire",
      badgeType: "trending",
      gradient: "from-red-700/25 via-orange-500/15 to-amber-500/20",
      icon: <Heart className="w-6 h-6" />,
    },
    {
      id: "married",
      title: "Femme Mariée",
      description: "Relation interdite",
      emotionalSubtitle: "Passion clandestine",
      sexyTagline: "C'est notre secret... 🤫",
      detailedDescription: "Une femme mariée qui cherche l'excitation que son couple ne lui offre plus...",
      photos: 38,
      videos: 7,
      likes: 950,
      dislikes: 120,
      badge: "Intense",
      badgeType: "premium",
      gradient: "from-red-700/25 via-orange-500/15 to-amber-500/20",
      icon: <Crown className="w-6 h-6" />,
      image: marriedCard,
    },
    {
      id: "boss",
      title: "La Patronne",
      description: "Autorité séduisante",
      emotionalSubtitle: "Pouvoir et désir",
      sexyTagline: "Dans mon bureau, maintenant... 👠",
      detailedDescription: "Ta patronne autoritaire qui aime mélanger travail et plaisir...",
      photos: 55,
      videos: 10,
      likes: 1050,
      dislikes: 78,
      badge: "Top 3",
      badgeType: "trending",
      gradient: "from-red-700/25 via-orange-500/15 to-amber-500/20",
      icon: <Briefcase className="w-6 h-6" />,
      image: bossCard,
      isOnline: true,
    },
    {
      id: "doctor",
      title: "Docteure",
      description: "Consultation privée",
      emotionalSubtitle: "Soins personnalisés",
      sexyTagline: "Je vais bien m'occuper de toi... 💊",
      detailedDescription: "Une docteure qui propose des consultations très... personnalisées...",
      photos: 42,
      videos: 9,
      likes: 840,
      dislikes: 61,
      badge: "Tendance",
      badgeType: "trending",
      gradient: "from-blue-900/25 via-indigo-600/15 to-purple-500/20",
      icon: <Stethoscope className="w-6 h-6" />,
      image: doctorCard,
    },
    {
      id: "secretary",
      title: "Secrétaire",
      description: "Assistante dévouée",
      emotionalSubtitle: "Dévouement absolu",
      sexyTagline: "Je ferais tout pour toi... 📋",
      detailedDescription: "Ta secrétaire qui ferait n'importe quoi pour te satisfaire...",
      photos: 48,
      videos: 11,
      likes: 920,
      dislikes: 55,
      badge: "Nouveau",
      badgeType: "new",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20",
      icon: <ClipboardList className="w-6 h-6" />,
      image: secretaryCard,
    },
    {
      id: "fitgirl",
      title: "La Fit Girl",
      description: "Énergie et sensualité",
      emotionalSubtitle: "Corps sculpté",
      sexyTagline: "Tu veux voir mes muscles ? 💪",
      detailedDescription: "Cette sportive passionnée qui aime repousser ses limites... et les tiennes.",
      photos: 65,
      videos: 14,
      likes: 1180,
      dislikes: 42,
      badge: "Populaire",
      badgeType: "trending",
      gradient: "from-red-700/25 via-orange-500/15 to-amber-500/20",
      icon: <Dumbbell className="w-6 h-6" />,
      image: fitgirlCard,
      isOnline: true,
    },
    {
      id: "university",
      title: "Universitaire",
      description: "Étudiante coquine",
      emotionalSubtitle: "Innocence trompeuse",
      sexyTagline: "On révise ensemble ? 📚",
      detailedDescription: "Cette étudiante rebelle qui aime jouer avec les limites entre cours et plaisir...",
      photos: 48,
      videos: 9,
      likes: 1050,
      dislikes: 47,
      badge: "Nouveau",
      badgeType: "new",
      gradient: "from-pink-600/25 via-rose-400/15 to-red-400/20",
      icon: <GraduationCap className="w-6 h-6" />,
      image: universityCard,
    },
    {
      id: "police",
      title: "Policière",
      description: "Autorité séduisante",
      emotionalSubtitle: "Loi et désir",
      sexyTagline: "Vous êtes en état d'arrestation... 🚔",
      detailedDescription: "Cette officière qui sait faire respecter l'ordre... à sa manière.",
      photos: 52,
      videos: 10,
      likes: 1120,
      dislikes: 58,
      badge: "Tendance",
      badgeType: "trending",
      gradient: "from-blue-900/25 via-indigo-600/15 to-purple-500/20",
      icon: <Shield className="w-6 h-6" />,
      image: policeCard,
    },
    {
      id: "teacher",
      title: "Professeure",
      description: "Enseignement privé",
      emotionalSubtitle: "Leçons particulières",
      sexyTagline: "Tu as été un mauvais élève... 👩‍🏫",
      detailedDescription: "Cette enseignante qui propose des cours privés très... instructifs.",
      photos: 46,
      videos: 8,
      likes: 980,
      dislikes: 51,
      badge: "Nouveau",
      badgeType: "new",
      gradient: "from-amber-600/25 via-orange-400/15 to-yellow-400/20",
      icon: <BookOpen className="w-6 h-6" />,
      image: teacherCard,
    },
    {
      id: "celebrity3",
      title: "Bonnio Blue",
      description: "Collaboration vérifiée",
      emotionalSubtitle: "Charme mystérieux",
      sexyTagline: "Je vais te montrer des secrets... 🔥",
      detailedDescription: "Une créatrice de contenu qui aime partager ses secrets les plus intimes...",
      photos: 180,
      videos: 28,
      likes: 1320,
      dislikes: 42,
      badge: "Top 3",
      badgeType: "verified",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20",
      isVerified: true,
      icon: <UserRound className="w-6 h-6" />,
    },
    {
      id: "celebrity4",
      title: "Sophie Raino",
      description: "Collaboration vérifiée",
      emotionalSubtitle: "Élégance sensuelle",
      sexyTagline: "Prêt pour une aventure ? ✨",
      detailedDescription: "Une personnalité captivante qui sait exactement comment te séduire...",
      photos: 165,
      videos: 22,
      likes: 1180,
      dislikes: 35,
      badge: "VIP",
      badgeType: "vip",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20",
      isVerified: true,
      isOnline: true,
      icon: <UserRound className="w-6 h-6" />,
    },
    {
      id: "celebrity5",
      title: "Bella Thorno",
      description: "Collaboration vérifiée",
      emotionalSubtitle: "Audace assumée",
      sexyTagline: "Je n'ai peur de rien... 😈",
      detailedDescription: "Une star audacieuse qui n'a peur de rien et qui aime provoquer...",
      photos: 195,
      videos: 32,
      likes: 1420,
      dislikes: 48,
      badge: "Premium",
      badgeType: "premium",
      gradient: "from-rose-500/25 via-purple-400/15 to-violet-500/20",
      isVerified: true,
      icon: <UserRound className="w-6 h-6" />,
    },
  ];

  // Categorize scenarios for different carousels
  const verifiedCharacters = scenarios.filter(s => s.isVerified);
  const trendingCharacters = scenarios.filter(s => s.badgeType === "trending" || s.likes > 900);
  const premiumCharacters = scenarios.filter(s => s.badgeType === "premium" || s.badgeType === "vip");
  const newCharacters = scenarios.filter(s => s.badgeType === "new");
  const intenseCharacters = scenarios.filter(s => ["married", "boss", "ex", "police"].includes(s.id));

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

  const isVerifiedScenario = selectedScenario?.isVerified;

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
      ) : (
        <>
          {/* Verified Characters Carousel */}
          <CharacterCarousel
            title="Vérifiées"
            subtitle="Personnalités certifiées"
            icon={<BadgeCheck className="w-6 h-6" />}
            characters={verifiedCharacters}
            isAuthenticated={isAuthenticated}
            favorites={favorites}
            onCharacterClick={handleScenarioClick}
            onFavoriteToggle={toggleFavorite}
            cardSize="large"
          />

          {/* Premium Banner */}
          <PremiumBanner />

          {/* Trending Characters */}
          <CharacterCarousel
            title="Très populaires"
            subtitle="Les plus appréciés cette semaine"
            icon={<Flame className="w-6 h-6" />}
            characters={trendingCharacters}
            isAuthenticated={isAuthenticated}
            favorites={favorites}
            onCharacterClick={handleScenarioClick}
            onFavoriteToggle={toggleFavorite}
          />

          {/* VIP & Premium */}
          <CharacterCarousel
            title="VIP & Premium"
            subtitle="Expériences exclusives"
            icon={<Crown className="w-6 h-6" />}
            characters={premiumCharacters}
            isAuthenticated={isAuthenticated}
            favorites={favorites}
            onCharacterClick={handleScenarioClick}
            onFavoriteToggle={toggleFavorite}
          />

          {/* Intense Scenarios */}
          <CharacterCarousel
            title="Scénarios intenses"
            subtitle="Pour les plus audacieux"
            icon={<Zap className="w-6 h-6" />}
            characters={intenseCharacters}
            isAuthenticated={isAuthenticated}
            favorites={favorites}
            onCharacterClick={handleScenarioClick}
            onFavoriteToggle={toggleFavorite}
          />

          {/* New Characters */}
          <CharacterCarousel
            title="Nouveautés"
            subtitle="Fraîchement arrivées"
            icon={<Sparkles className="w-6 h-6" />}
            characters={newCharacters}
            isAuthenticated={isAuthenticated}
            favorites={favorites}
            onCharacterClick={handleScenarioClick}
            onFavoriteToggle={toggleFavorite}
          />

          {/* All Characters Section */}
          <CharacterCarousel
            title="Tous les personnages"
            subtitle="Explore toutes les possibilités"
            icon={<Star className="w-6 h-6" />}
            characters={scenarios}
            isAuthenticated={isAuthenticated}
            favorites={favorites}
            onCharacterClick={handleScenarioClick}
            onFavoriteToggle={toggleFavorite}
            cardSize="small"
          />
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

      {/* Configuration Dialog */}
      <Dialog open={selectedScenario !== null} onOpenChange={(open) => !open && setSelectedScenario(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-primary">
                {selectedScenario?.icon}
              </div>
              {selectedScenario?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedScenario?.detailedDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* User Nickname */}
            <div className="space-y-2">
              <Label htmlFor="userNickname" className="text-foreground font-semibold">
                Nom par lequel je veux être appelé
              </Label>
              <Input
                id="userNickname"
                value={userNickname}
                onChange={(e) => setUserNickname(e.target.value)}
                placeholder="Ton prénom ou pseudo..."
                className="bg-background border-border"
              />
            </div>

            {/* Character Settings (only for non-verified) */}
            {!isVerifiedScenario && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold">Sexe du personnage</Label>
                  <Select value={characterGender} onValueChange={setCharacterGender}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="femme">Femme</SelectItem>
                      <SelectItem value="homme">Homme</SelectItem>
                    </SelectContent>
                  </Select>
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
                      🎲 Random
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
              </>
            )}

            {/* Writing Style */}
            <div className="space-y-3">
              <Label className="text-foreground font-semibold">Style d'écriture</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "shortSuggestive", label: "Court et suggestif", state: shortSuggestive, setter: setShortSuggestive },
                  { id: "softDetailed", label: "Doux et détaillé", state: softDetailed, setter: setSoftDetailed },
                  { id: "teasingTone", label: "Ton taquin", state: teasingTone, setter: setTeasingTone },
                  { id: "romanticTone", label: "Ton romantique", state: romanticTone, setter: setRomanticTone },
                  { id: "intenseTone", label: "Ton intense", state: intenseTone, setter: setIntenseTone },
                  { id: "withEmojis", label: "Avec emojis", state: withEmojis, setter: setWithEmojis },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={item.state}
                      onCheckedChange={(checked) => item.setter(checked as boolean)}
                    />
                    <label htmlFor={item.id} className="text-sm text-foreground cursor-pointer">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div className="space-y-3">
              <Label className="text-foreground font-semibold">Intensité des échanges</Label>
              <RadioGroup value={intensity} onValueChange={setIntensity} className="grid grid-cols-3 gap-2">
                {[
                  { value: "doux", label: "Doux" },
                  { value: "sensuel", label: "Sensuel" },
                  { value: "intense", label: "Intense" },
                ].map((item) => (
                  <div key={item.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={item.value} id={item.value} />
                    <label htmlFor={item.value} className="text-sm text-foreground cursor-pointer">
                      {item.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Response Rhythm */}
            <div className="space-y-3">
              <Label className="text-foreground font-semibold">Rythme des réponses</Label>
              <RadioGroup value={responseRhythm} onValueChange={setResponseRhythm} className="space-y-2">
                {[
                  { value: "natural", label: "Naturel (simulé)" },
                  { value: "instant", label: "Instantané" },
                  { value: "slow", label: "Lent et pensif" },
                ].map((item) => (
                  <div key={item.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={item.value} id={item.value} />
                    <label htmlFor={item.value} className="text-sm text-foreground cursor-pointer">
                      {item.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* CTA */}
            <div className="pt-4 space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                ✨ Tu es prêt ? Elle t'attend…
              </p>
              <Button
                onClick={handleStartChat}
                disabled={!userNickname || (!isVerifiedScenario && !characterName)}
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
