import { useState } from "react";
import { Heart, Lock, BadgeCheck, Crown, Flame, Sparkles, MessageCircle } from "lucide-react";
import type { Fantasy } from "@/types/Fantasy";

interface CharacterCardProps {
  fantasy: Fantasy;
  isLocked?: boolean;
  isFavorite?: boolean;
  onClick: () => void;
  onFavoriteToggle: (e: React.MouseEvent) => void;
  size?: "small" | "medium" | "large";
}

const CharacterCard = ({
  fantasy,
  isLocked = false,
  isFavorite = false,
  onClick,
  onFavoriteToggle,
  size = "medium",
}: CharacterCardProps) => {
  // Log pour vérification
  console.log("CARD FANTASY:", fantasy);
  
  // Extraction des champs depuis fantasy (snake_case de Supabase)
  const {
    title,
    emotionalSubtitle,
    sexyTagline,
    image,
    gradient,
    badge,
    badge_type,
    isOnline = false,
  } = fantasy;
  
  const badgeType = badge_type || "trending";
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "w-40 h-56",
    medium: "w-52 h-72",
    large: "w-64 h-80",
  };

  const getBadgeStyles = () => {
    switch (badgeType) {
      case "trending":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]";
      case "premium":
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]";
      case "new":
        return "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.5)]";
      case "verified":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-[0_0_15px_rgba(96,165,250,0.5)]";
      case "vip":
        return "bg-gradient-to-r from-violet to-pink-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]";
      default:
        return "bg-primary text-white shadow-[0_0_15px_rgba(255,77,141,0.5)]";
    }
  };

  const getBadgeIcon = () => {
    switch (badgeType) {
      case "trending":
        return <Flame className="w-3 h-3" />;
      case "premium":
        return <Crown className="w-3 h-3" />;
      case "vip":
        return <Crown className="w-3 h-3" />;
      case "verified":
        return <BadgeCheck className="w-3 h-3" />;
      default:
        return <Sparkles className="w-3 h-3" />;
    }
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group micro-parallax`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={!isLocked ? onClick : undefined}
      style={{
        boxShadow: isHovered 
          ? '0 25px 80px rgba(139, 92, 246, 0.3), 0 0 60px rgba(255, 77, 141, 0.25), 0 0 30px rgba(255, 178, 156, 0.15)' 
          : '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(139, 92, 246, 0.1)',
      }}
    >
      {/* Background Image/Gradient */}
      <div className="absolute inset-0">
        {image ? (
          <>
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                filter: 'brightness(0.9) contrast(1.05) saturate(1.1)',
              }}
            />
            {/* Premium Violet/Rose Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(139,92,246,0.2)_70%,rgba(0,0,0,0.6)_100%)]" />
          </>
        ) : (
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, hsl(270 60% 30% / 0.8) 0%, hsl(338 100% 35% / 0.6) 50%, hsl(20 100% 50% / 0.4) 100%)',
            }}
          />
        )}
        
        {/* Bottom Gradient for Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
        
        {/* Hover Glow Effect - Violet/Peach */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-violet/40 via-primary/20 to-peach/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Pink/Violet Halo on Hover */}
        <div 
          className={`absolute -inset-2 bg-gradient-to-r from-violet/50 via-primary/50 to-peach/40 rounded-2xl blur-2xl transition-opacity duration-300 -z-10 ${isHovered ? 'opacity-70' : 'opacity-0'}`}
        />
      </div>

      {/* Badge with Glow */}
      {badge && (
        <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${getBadgeStyles()}`}>
          {getBadgeIcon()}
          {badge}
        </div>
      )}


      {/* Favorite/Lock Button */}
      {isLocked ? (
        <div className="absolute top-3 right-3 z-10 p-2 rounded-xl glass">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      ) : (
        <button
          onClick={onFavoriteToggle}
          className="absolute top-3 right-3 z-10 p-2 rounded-xl glass hover:bg-card/80 transition-colors group/fav"
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${
              isFavorite 
                ? "fill-primary text-primary scale-110" 
                : "text-white group-hover/fav:text-primary group-hover/fav:scale-110"
            }`}
            style={{
              filter: isFavorite ? 'drop-shadow(0 0 10px rgba(255, 77, 141, 0.8))' : 'none'
            }}
          />
        </button>
      )}


      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="space-y-1">
          <h3 className="font-bold text-white text-lg drop-shadow-lg flex items-center gap-2">
            {title}
          </h3>
          <p 
            className="text-sm font-medium"
            style={{
              background: 'linear-gradient(90deg, hsl(338 100% 65%), hsl(280 70% 65%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {emotionalSubtitle}
          </p>
          
          {/* Sexy Tagline on Hover */}
          <div 
            className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <p className="text-white/90 text-xs pt-2 flex items-center gap-1">
              <MessageCircle className="w-3 h-3 text-primary" />
              "{sexyTagline}"
            </p>
          </div>
        </div>
      </div>

      {/* Hover CTA */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isHovered && !isLocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="px-5 py-2.5 rounded-full text-white font-semibold text-sm"
          style={{
            background: 'linear-gradient(135deg, hsl(338 100% 55%), hsl(280 70% 50%))',
            boxShadow: '0 0 30px rgba(255, 77, 141, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)',
          }}
        >
          Viens me parler 😘
        </div>
      </div>

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Connecte-toi</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterCard;
