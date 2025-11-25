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
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={lydiaLogo} 
            alt="Lydia" 
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-xl font-semibold text-foreground animate-fade-in">
            {currentTitle}
          </h1>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
