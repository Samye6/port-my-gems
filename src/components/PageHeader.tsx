import { useLocation } from "react-router-dom";

interface PageTitles {
  [key: string]: string;
}

const PageHeader = () => {
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
      <div className="px-4 py-4">
        <h1 className="text-xl font-semibold text-foreground animate-fade-in">
          {currentTitle}
        </h1>
      </div>
    </div>
  );
};

export default PageHeader;
