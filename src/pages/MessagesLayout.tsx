import { useParams } from "react-router-dom";
import Conversations from "./Conversations";
import ChatConversation from "./ChatConversation";
import BottomNav from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import lydiaLogo from "@/assets/lydia-logo.png";

const MessagesLayout = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  // Sur mobile, si aucune conversation n'est sélectionnée, afficher seulement la liste
  if (isMobile && !id) {
    return (
      <>
        <Conversations />
        <BottomNav />
      </>
    );
  }

  // Sur mobile, si une conversation est sélectionnée, afficher seulement le chat
  if (isMobile && id) {
    return (
      <>
        <ChatConversation />
        <BottomNav />
      </>
    );
  }

  // Sur desktop, afficher les deux côte à côte
  return (
    <>
      <div className="flex h-screen w-full overflow-hidden pb-20">
        {/* Liste des conversations - côté gauche */}
        <div className="w-[400px] border-r border-border flex-shrink-0 overflow-hidden">
          <Conversations />
        </div>

        {/* Zone de chat - côté droit */}
        <div className="flex-1 flex flex-col">
          {id ? (
            <ChatConversation />
          ) : (
            <div className="h-full flex items-center justify-center bg-background">
              <div className="text-center space-y-6 max-w-md px-6">
                <div className="w-40 h-40 mx-auto flex items-center justify-center">
                  <img 
                    src={lydiaLogo} 
                    alt="Lydia Logo" 
                    className="w-full h-full object-contain animate-pulse"
                    style={{ filter: 'drop-shadow(0 0 20px rgba(255, 77, 141, 0.4))' }}
                  />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Lydia — Chat Érotique IA
                </h2>
                <p className="text-muted-foreground">
                  Sélectionnez une conversation à gauche ou démarrez-en une nouvelle pour commencer
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default MessagesLayout;
