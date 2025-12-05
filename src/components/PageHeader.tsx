import { useLocation } from "react-router-dom";
import { ReactNode } from "react";
import lydiaLogo from "@/assets/lydia-logo.png";

interface PageTitles {
  [key: string]: string;
}

interface PageHeaderProps {
  rightAction?: ReactNode;
}

const PageHeader = ({ rightAction }: PageHeaderProps) => {
  const location = useLocation();

  const pageTitles: PageTitles = {
    "/home": "Home",
    "/conversations": "Mes conversations",
    "/profile": "Mon profil",
    "/scenarios": "Scénarios",
    "/shop": "Boutique",
    "/premium": "Premium",
  };

  const currentTitle = pageTitles[location.pathname] || "Lydia";

  return (
    <div className="sticky top-0 z-10 relative">
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
        
        <div className="px-4 py-4 flex items-center justify-between relative z-10">
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
                className="w-8 h-8 object-contain relative z-10 transition-all duration-200 group-hover:scale-105 group-hover:brightness-110"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.3))',
                }}
              />
            </div>
            
            {/* Title with premium typography */}
            <h1 
              className="text-xl font-semibold animate-fade-in tracking-wide"
              style={{
                color: '#FFE6F5',
                textShadow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(236, 72, 153, 0.15)',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {currentTitle}
            </h1>
          </div>
          
          {/* Right action with premium styling */}
          {rightAction && (
            <div className="header-actions">
              {rightAction}
            </div>
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
    </div>
  );
};

export default PageHeader;
