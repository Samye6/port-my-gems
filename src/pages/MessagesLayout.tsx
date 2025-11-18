import { useParams } from "react-router-dom";
import Conversations from "./Conversations";
import ChatConversation from "./ChatConversation";
import { useIsMobile } from "@/hooks/use-mobile";

const MessagesLayout = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  // Sur mobile, si aucune conversation n'est sélectionnée, afficher seulement la liste
  if (isMobile && !id) {
    return <Conversations />;
  }

  // Sur mobile, si une conversation est sélectionnée, afficher seulement le chat
  if (isMobile && id) {
    return <ChatConversation />;
  }

  // Sur desktop, afficher les deux côte à côte
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Liste des conversations - côté gauche */}
      <div className="w-[400px] border-r border-border flex-shrink-0 overflow-hidden">
        <Conversations />
      </div>

      {/* Zone de chat - côté droit */}
      <div className="flex-1 overflow-hidden">
        {id ? (
          <ChatConversation />
        ) : (
          <div className="h-full flex items-center justify-center bg-background">
            <div className="text-center space-y-4 max-w-md px-6">
              <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
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
  );
};

export default MessagesLayout;
