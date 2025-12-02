import { useState } from "react";
import { Heart, Lock, BadgeCheck, Crown, Flame, Sparkles, MessageCircle } from "lucide-react";

interface CharacterCardProps {
  id: string;
  title: string;
  emotionalSubtitle: string;
  sexyTagline: string;
  image?: string;
  gradient: string;
  badge?: string;
  badgeType?: "trending" | "premium" | "new" | "verified" | "vip";
  isVerified?: boolean;
  isLocked?: boolean;
  isFavorite?: boolean;
  isOnline?: boolean;
  onClick: () => void;
  onFavoriteToggle: (e: React.MouseEvent) => void;
  size?: "small" | "medium" | "large";
}

const CharacterCard = ({
  id,
  title,
  emotionalSubtitle,
  sexyTagline,
  image,
  gradient,
  badge,
  badgeType = "trending",
  isVerified = false,
  isLocked = false,
  isFavorite = false,
  isOnline = false,
  onClick,
  onFavoriteToggle,
  size = "medium",
}: CharacterCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "w-40 h-56",
    medium: "w-52 h-72",
    large: "w-64 h-80",
  };

  const getBadgeStyles = () => {
    switch (badgeType) {
      case "trending":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white";
      case "premium":
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-black";
      case "new":
        return "bg-gradient-to-r from-emerald-400 to-teal-500 text-white";
      case "verified":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
      case "vip":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      default:
        return "bg-primary text-white";
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
      className={`relative ${sizeClasses[size]} flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={!isLocked ? onClick : undefined}
      style={{
        transform: isHovered ? 'scale(1.05) translateY(-8px)' : 'scale(1)',
        boxShadow: isHovered 
          ? '0 20px 60px rgba(255, 77, 141, 0.3), 0 0 40px rgba(255, 77, 141, 0.2)' 
          : '0 8px 30px rgba(0, 0, 0, 0.3)',
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
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.5)_100%)]" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
        
        {/* Bottom Gradient for Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Hover Glow Effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        
        {/* Pink Halo on Hover */}
        <div 
          className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-pink-500/50 to-purple-500/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10"
        />
      </div>

      {/* Badge */}
      {badge && (
        <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${getBadgeStyles()} shadow-lg`}>
          {getBadgeIcon()}
          {badge}
        </div>
      )}

      {/* Online Indicator */}
      {isOnline && (
        <div className="absolute top-3 right-12 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] text-emerald-400 font-medium">En ligne</span>
        </div>
      )}

      {/* Favorite/Lock Button */}
      {isLocked ? (
        <div className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-black/50 backdrop-blur-sm">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      ) : (
        <button
          onClick={onFavoriteToggle}
          className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors group/fav"
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${
              isFavorite 
                ? "fill-primary text-primary scale-110" 
                : "text-white group-hover/fav:text-primary group-hover/fav:scale-110"
            }`}
            style={{
              filter: isFavorite ? 'drop-shadow(0 0 8px rgba(255, 77, 141, 0.8))' : 'none'
            }}
          />
        </button>
      )}

      {/* Verified Badge */}
      {isVerified && (
        <div className="absolute top-12 right-3 z-10">
          <BadgeCheck className="w-5 h-5 text-blue-400 fill-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="space-y-1">
          <h3 className="font-bold text-white text-lg drop-shadow-lg flex items-center gap-2">
            {title}
            {isVerified && <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-400" />}
          </h3>
          <p className="text-primary text-sm font-medium">{emotionalSubtitle}</p>
          
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
        <div className="px-4 py-2 rounded-full bg-primary text-white font-semibold text-sm shadow-[0_0_20px_rgba(255,77,141,0.5)] animate-pulse">
          Viens me parler 😘
        </div>
      </div>

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
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
