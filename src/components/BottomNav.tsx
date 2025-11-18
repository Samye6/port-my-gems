import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/home",
      activeColor: "text-primary",
    },
    {
      icon: MessageCircle,
      label: "Conversations",
      path: "/conversations",
      activeColor: "text-primary",
    },
    {
      icon: User,
      label: "Profil",
      path: "/profile",
      activeColor: "text-primary",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around max-w-md mx-auto px-6 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                active ? "scale-110" : "scale-100 opacity-70"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-colors duration-300",
                  active ? "bg-primary/10" : ""
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-colors duration-300",
                    active ? item.activeColor : "text-foreground"
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  active ? item.activeColor : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
