import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Flame, Search, Users, Dumbbell, GraduationCap, Shield, BookOpen, MessageCircle, Star } from "lucide-react";
import { getRandomAvatar } from "@/utils/avatars";
import lydiaLogo from "@/assets/lydia-logo.png";
import colleagueCard from "@/assets/colleague-card.png";
import universityCard from "@/assets/university-card.png";
import policeCard from "@/assets/police-card.png";
import teacherCard from "@/assets/teacher-card.png";
import fitgirlCard from "@/assets/fitgirl-card.png";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import HeroSection from "@/components/home/HeroSection";
import PremiumBanner from "@/components/home/PremiumBanner";
import SearchBar from "@/components/home/SearchBar";
import FantasyCharacterModal, { type FantasyCharacter } from "@/components/home/FantasyCharacterModal";

import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/hooks/use-toast";

// Image mapping by slug
const IMAGE_MAP: Record<string, string> = {
  'collegue': colleagueCard,
  'fit-girl': fitgirlCard,
  'universitaire': universityCard,
  'policiere': policeCard,
  'professeure': teacherCard,
};

// Slug to internal id mapping for conversation routing
const SLUG_TO_ID: Record<string, string> = {
  'collegue': 'colleague',
  'fit-girl': 'fitgirl',
  'universitaire': 'university',
  'policiere': 'police',
  'professeure': 'teacher',
};

const Scenarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createConversation } = useConversations();
  const [selectedCharacter, setSelectedCharacter] = useState<FantasyCharacter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [characters, setCharacters] = useState<FantasyCharacter[]>([]);
  const [loading, setLoading] = useState(true);
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
      (event, session) => setIsAuthenticated(!!session)
    );
    return () => subscription.unsubscribe();
  }, []);

  // Fetch from fantasy_characters
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const { data, error } = await supabase
          .from("fantasy_characters")
          .select("*")
          .order("recommended", { ascending: false });

        if (error) {
          console.error("Error fetching fantasy_characters:", error);
          setLoading(false);
          return;
        }

        setCharacters((data as FantasyCharacter[]) || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  const handleCardClick = (character: FantasyCharacter) => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    setSelectedCharacter(character);
  };

  const toggleFavorite = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(slug)
      ? favorites.filter((s) => s !== slug)
      : [...favorites, slug];
    setFavorites(newFavorites);
    localStorage.setItem("favoriteScenarios", JSON.stringify(newFavorites));
  };

  const filteredCharacters = characters.filter((c) =>
    c.scenario_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.card_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.first_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = async () => {
    if (!selectedCharacter) return;
    try {
      const avatarUrl = getRandomAvatar();
      const internalId = SLUG_TO_ID[selectedCharacter.slug] || selectedCharacter.slug;

      const preferences = {
        characterName: selectedCharacter.first_name,
        characterAge: selectedCharacter.age,
        personality: selectedCharacter.personality_tags,
        meetingStory: selectedCharacter.encounter_preview,
        avatarUrl,
        responseRhythm: "natural",
      };

      const conversation = await createConversation({
        character_name: selectedCharacter.first_name,
        character_avatar: avatarUrl,
        scenario_id: internalId,
        preferences,
      });

      navigate(`/conversations/${conversation.id}`, {
        state: { scenarioId: internalId, preferences },
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la conversation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 relative">
        <div
          className="relative backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(11, 11, 13, 0.95) 0%, rgba(88, 28, 135, 0.15) 50%, rgba(219, 39, 119, 0.08) 100%)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            }}
          />
          <div className="container flex h-16 items-center justify-between px-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative group cursor-pointer">
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
                  style={{ filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.3))' }}
                />
              </div>
              <h1
                className="text-xl font-bold tracking-wide"
                style={{
                  color: '#FFE6F5',
                  textShadow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(236, 72, 153, 0.15)',
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
                style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.2)' }}
              >
                Se connecter
              </Button>
            )}
          </div>
        </div>
        <div
          className="h-[1px] w-full"
          style={{
            background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.6) 50%, rgba(251, 146, 60, 0.4) 100%)',
            boxShadow: '0 1px 8px rgba(236, 72, 153, 0.3)',
          }}
        />
      </header>

      {/* Hero */}
      <HeroSection
        onStartChat={() => {
          if (characters[0]) handleCardClick(characters[0]);
        }}
        isAuthenticated={isAuthenticated}
      />

      {/* Search */}
      <section className="container px-6 py-8 -mt-8 relative z-20">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </section>

      {/* Content */}
      {loading ? (
        <section className="container px-6 py-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Chargement…</p>
          </div>
        </section>
      ) : characters.length === 0 ? (
        <section className="container px-6 py-12 text-center">
          <p className="text-muted-foreground">Aucun scénario disponible</p>
        </section>
      ) : (
        <>
          {/* Section title */}
          <section className="container px-6 pb-2">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Fantasy</h2>
              <span className="text-sm text-muted-foreground ml-1">Scénarios immersifs</span>
            </div>
          </section>

          {/* Character Cards Grid */}
          <section className="container px-6 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {(searchQuery ? filteredCharacters : characters).map((character, index) => (
                <div
                  key={character.id}
                  className="group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                  onClick={() => handleCardClick(character)}
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-card border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
                    {/* Image */}
                    {IMAGE_MAP[character.slug] ? (
                      <img
                        src={IMAGE_MAP[character.slug]}
                        alt={character.scenario_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ filter: 'brightness(0.85) contrast(1.05) saturate(1.1)' }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 via-violet/20 to-muted" />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Recommended badge */}
                    {character.recommended && (
                      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 bg-gradient-to-r from-primary to-pink-500 text-primary-foreground shadow-[0_0_15px_rgba(255,77,141,0.5)]">
                        <Star className="w-3 h-3" />
                        Recommandé
                      </div>
                    )}

                    {/* Favorite */}
                    <button
                      onClick={(e) => toggleFavorite(e, character.slug)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-xl glass hover:bg-card/80 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all duration-300 ${
                          favorites.includes(character.slug)
                            ? "fill-primary text-primary scale-110"
                            : "text-white group-hover:text-primary"
                        }`}
                        style={{
                          filter: favorites.includes(character.slug) ? 'drop-shadow(0 0 10px rgba(255, 77, 141, 0.8))' : 'none'
                        }}
                      />
                    </button>

                    {/* Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <h3 className="font-bold text-white text-base drop-shadow-lg">{character.scenario_name}</h3>
                      <p
                        className="text-sm font-medium mt-0.5"
                        style={{
                          background: 'linear-gradient(90deg, hsl(338 100% 65%), hsl(280 70% 65%))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {character.card_title}
                      </p>
                      <p className="text-[11px] text-white/60 mt-1">{character.card_subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <PremiumBanner />
        </>
      )}

      {/* Modal */}
      <FantasyCharacterModal
        character={selectedCharacter}
        open={selectedCharacter !== null}
        onOpenChange={(open) => { if (!open) setSelectedCharacter(null); }}
        onStartChat={handleStartChat}
      />

      <BottomNav />
    </div>
  );
};

export default Scenarios;
