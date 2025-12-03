import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Heart } from "lucide-react";

// Import avatars
import avatar1 from "@/assets/avatars/avatar-1.jpg";
import avatar2 from "@/assets/avatars/avatar-2.jpg";
import avatar3 from "@/assets/avatars/avatar-3.jpg";
import avatar4 from "@/assets/avatars/avatar-4.jpg";
import avatar5 from "@/assets/avatars/avatar-5.jpg";

interface SuggestedCharacter {
  id: string;
  name: string;
  subtitle: string;
  avatar: string;
  badge?: "online" | "vip" | "trending";
  scenarioId?: string;
}

const suggestedCharacters: SuggestedCharacter[] = [
  {
    id: "1",
    name: "Tamara",
    subtitle: "Nouvelle voisine",
    avatar: avatar1,
    badge: "online",
    scenarioId: "demo-tamara"
  },
  {
    id: "2", 
    name: "Clara",
    subtitle: "Collègue mystérieuse",
    avatar: avatar2,
    badge: "trending",
    scenarioId: "colleague"
  },
  {
    id: "3",
    name: "Sophia",
    subtitle: "Fit girl motivée",
    avatar: avatar3,
    badge: "vip",
    scenarioId: "fitgirl"
  },
  {
    id: "4",
    name: "Emma",
    subtitle: "L'inconnue du bar",
    avatar: avatar4,
    badge: "online",
    scenarioId: "unknown"
  },
  {
    id: "5",
    name: "Léa",
    subtitle: "Docteur attentionnée",
    avatar: avatar5,
    badge: "trending",
    scenarioId: "doctor"
  }
];

const SuggestedCharacters = () => {
  const navigate = useNavigate();

  const handleCharacterClick = (character: SuggestedCharacter) => {
    navigate(`/conversations/${character.scenarioId}`, {
      state: {
        preferences: {
          characterName: character.name,
          avatarUrl: character.avatar
        },
        scenarioId: character.scenarioId
      }
    });
  };

  const getBadgeContent = (badge?: string) => {
    switch (badge) {
      case "online":
        return (
          <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 animate-pulse">
            En ligne
          </Badge>
        );
      case "vip":
        return (
          <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-gold to-peach text-black text-[10px] px-1.5 py-0.5 flex items-center gap-0.5">
            <Crown className="w-2.5 h-2.5" />
            VIP
          </Badge>
        );
      case "trending":
        return (
          <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-violet to-primary text-white text-[10px] px-1.5 py-0.5 flex items-center gap-0.5">
            <Heart className="w-2.5 h-2.5 fill-current" />
            Hot
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Title */}
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet via-primary to-peach bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Elles veulent te parler…
        </h2>
        <p className="text-sm text-muted-foreground">
          Personnalités disponibles maintenant, prêtes à discuter.
        </p>
      </div>

      {/* Characters Slider */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
        {suggestedCharacters.map((character, index) => (
          <button
            key={character.id}
            onClick={() => handleCharacterClick(character)}
            className="flex-shrink-0 group animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative glass border border-border/30 rounded-2xl p-4 w-32 transition-all duration-300 hover:scale-105 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet/10 via-primary/10 to-peach/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              {/* Avatar with halo */}
              <div className="relative mx-auto w-20 h-20 mb-3">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet via-primary to-peach rounded-full opacity-40 group-hover:opacity-70 blur-md transition-opacity" />
                <Avatar className="w-20 h-20 ring-2 ring-border/50 group-hover:ring-primary/50 transition-all relative">
                  <AvatarImage src={character.avatar} alt={character.name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-violet/30 to-primary/30 text-xl">
                    {character.name[0]}
                  </AvatarFallback>
                </Avatar>
                {getBadgeContent(character.badge)}
              </div>

              {/* Character info */}
              <div className="text-center relative z-10">
                <h3 className="font-semibold text-foreground text-sm mb-0.5 group-hover:text-primary transition-colors">
                  {character.name}
                </h3>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {character.subtitle}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedCharacters;
