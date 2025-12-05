import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUnread } from "@/contexts/UnreadContext";
import { useState } from "react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useUnread();
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: MessageCircle,
      label: "Conversations",
      path: "/conversations",
    },
    {
      icon: User,
      label: "Profil",
      path: "/profile",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleClick = (path: string) => {
    setClickedItem(path);
    navigate(path);
    // Reset click animation after 200ms
    setTimeout(() => setClickedItem(null), 200);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Premium gradient top border */}
      <div 
        className="h-[1.5px] w-full"
        style={{
          background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.6) 0%, rgba(236, 72, 153, 0.7) 50%, rgba(251, 146, 60, 0.5) 100%)',
          boxShadow: '0 -1px 10px rgba(236, 72, 153, 0.3)',
        }}
      />
      
      {/* Main navigation container with glassmorphism */}
      <div 
        className="relative backdrop-blur-xl"
        style={{
          background: 'linear-gradient(180deg, rgba(107, 33, 168, 0.08) 0%, rgba(10, 10, 12, 0.85) 30%, rgba(10, 10, 12, 0.95) 100%)',
        }}
      >
        {/* Subtle glow effect behind the bar */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(139, 92, 246, 0.06) 0%, rgba(236, 72, 153, 0.04) 40%, transparent 70%)',
          }}
        />
        
        <div className="flex items-center justify-around max-w-md mx-auto px-6 py-4 relative z-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const isClicked = clickedItem === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleClick(item.path)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all duration-200 ease-out group",
                  isClicked && "scale-110",
                  !active && "opacity-70 hover:opacity-100"
                )}
                style={{
                  transform: isClicked ? 'scale(1.1)' : active ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <div
                  className={cn(
                    "relative p-2.5 rounded-xl transition-all duration-200"
                  )}
                  style={{
                    background: active 
                      ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)'
                      : 'transparent',
                    boxShadow: active 
                      ? '0 0 20px rgba(236, 72, 153, 0.25), inset 0 0 10px rgba(139, 92, 246, 0.1)'
                      : 'none',
                  }}
                >
                  {/* Active icon glow background */}
                  {active && (
                    <div 
                      className="absolute inset-0 rounded-xl opacity-60 blur-md"
                      style={{
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(139, 92, 246, 0.2) 70%, transparent 100%)',
                        transform: 'scale(1.3)',
                      }}
                    />
                  )}
                  
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-40 transition-opacity duration-200 blur-md"
                    style={{
                      background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
                      transform: 'scale(1.2)',
                    }}
                  />
                  
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-all duration-200 relative z-10",
                      active ? "" : "group-hover:scale-105"
                    )}
                    strokeWidth={active ? 2.5 : 2}
                    style={{
                      color: active ? '#EC4899' : '#B8B8C5',
                      filter: active 
                        ? 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))' 
                        : 'none',
                    }}
                  />
                  
                  {/* Unread badge for conversations */}
                  {item.path === "/conversations" && unreadCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 animate-pulse"
                      style={{
                        background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                        color: 'white',
                        boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)',
                      }}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                
                {/* Label with gradient for active state */}
                <span
                  className="text-xs font-medium transition-all duration-200"
                  style={{
                    color: active ? 'transparent' : '#B8B8C5',
                    background: active 
                      ? 'linear-gradient(90deg, #EC4899 0%, #F97316 100%)'
                      : 'none',
                    WebkitBackgroundClip: active ? 'text' : 'unset',
                    backgroundClip: active ? 'text' : 'unset',
                    opacity: active ? 1 : 0.6,
                    textShadow: active ? '0 0 20px rgba(236, 72, 153, 0.5)' : 'none',
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Bottom safe area glow */}
      <div 
        className="h-[env(safe-area-inset-bottom)] w-full"
        style={{
          background: 'rgba(10, 10, 12, 0.95)',
        }}
      />
    </div>
  );
};

export default BottomNav;
