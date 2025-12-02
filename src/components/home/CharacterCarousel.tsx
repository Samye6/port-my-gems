import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CharacterCard from "./CharacterCard";

interface Character {
  id: string;
  title: string;
  emotionalSubtitle: string;
  sexyTagline: string;
  image?: string;
  gradient: string;
  badge?: string;
  badgeType?: "trending" | "premium" | "new" | "verified" | "vip";
  isVerified?: boolean;
  isOnline?: boolean;
}

interface CharacterCarouselProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  characters: Character[];
  isAuthenticated: boolean;
  favorites: string[];
  onCharacterClick: (character: Character) => void;
  onFavoriteToggle: (e: React.MouseEvent, characterId: string) => void;
  cardSize?: "small" | "medium" | "large";
  glowColor?: "violet" | "peach" | "primary";
}

const CharacterCarousel = ({
  title,
  subtitle,
  icon,
  characters,
  isAuthenticated,
  favorites,
  onCharacterClick,
  onFavoriteToggle,
  cardSize = "medium",
  glowColor = "violet",
}: CharacterCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === "left" 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth"
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const isScenarioUnlocked = (scenarioId: string) => {
    return scenarioId === "colleague" || scenarioId === "doctor";
  };

  const glowClasses = {
    violet: "section-glow-violet",
    peach: "section-glow-peach",
    primary: "",
  };

  return (
    <section className={`relative py-8 ${glowClasses[glowColor]}`}>
      {/* Section Header */}
      <div className="container px-6 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div 
                className="text-primary"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255, 77, 141, 0.5))'
                }}
              >
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className={`rounded-full w-9 h-9 glass border-border/30 transition-all duration-300 ${showLeftArrow ? 'opacity-100 hover:border-primary/50' : 'opacity-30'}`}
              onClick={() => scroll("left")}
              disabled={!showLeftArrow}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className={`rounded-full w-9 h-9 glass border-border/30 transition-all duration-300 ${showRightArrow ? 'opacity-100 hover:border-primary/50' : 'opacity-30'}`}
              onClick={() => scroll("right")}
              disabled={!showRightArrow}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Left Fade */}
        <div className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none transition-opacity ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto scrollbar-hide px-6 py-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {characters.map((character, index) => {
            const isUnlocked = isScenarioUnlocked(character.id);
            const isLocked = !isAuthenticated && !isUnlocked;
            
            return (
              <div 
                key={character.id}
                className="animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 80}ms`,
                  scrollSnapAlign: 'start'
                }}
              >
                <CharacterCard
                  {...character}
                  isLocked={isLocked}
                  isFavorite={favorites.includes(character.id)}
                  onClick={() => onCharacterClick(character)}
                  onFavoriteToggle={(e) => onFavoriteToggle(e, character.id)}
                  size={cardSize}
                />
              </div>
            );
          })}
        </div>

        {/* Right Fade */}
        <div className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none transition-opacity ${showRightArrow ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </section>
  );
};

export default CharacterCarousel;
