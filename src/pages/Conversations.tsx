import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, MoreVertical, Pin, Archive, Trash2, Plus, Bell, BellOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileImageModal from "@/components/ProfileImageModal";
import avatar1 from "@/assets/avatars/avatar-1.jpg";
import { useUnread } from "@/contexts/UnreadContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSoundSettings } from "@/hooks/useSoundSettings";
import { useConversations } from "@/hooks/useConversations";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isPinned?: boolean;
  isRead?: boolean;
  isArchived?: boolean;
  avatarUrl?: string;
}

const Conversations = () => {
  const navigate = useNavigate();
  const { id: activeConversationId } = useParams();
  const { setUnreadCount } = useUnread();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{ imageUrl?: string; name: string } | null>(null);
  const { isMuted, toggleMute } = useSoundSettings();
  const { conversations: dbConversations, updateConversation, deleteConversation: deleteConv, loading } = useConversations();
  
  const demoConversation: Conversation = {
    id: "demo-tamara",
    name: "Tamara",
    lastMessage: "Bonjour.. ou salut je sais pas haha... Je viens d'emménager dans le quartier. Je connais pas grand monde en ville mais j'ai eu ton numéro par une amie. Ça te dérange pas si on continue à parler un peu :) ?",
    time: "Maintenant",
    unread: 1,
    isPinned: false,
    isRead: false,
    avatarUrl: avatar1,
  };

  // Convertir les conversations de la DB au format local
  const conversations: Conversation[] = isAuthenticated 
    ? dbConversations.map(conv => ({
        id: conv.id,
        name: conv.character_name,
        lastMessage: conv.last_message || "",
        time: conv.last_message_time 
          ? format(new Date(conv.last_message_time), "HH:mm", { locale: fr })
          : "",
        unread: conv.unread_count,
        isPinned: conv.is_pinned,
        isRead: conv.unread_count === 0,
        isArchived: conv.is_archived,
        avatarUrl: conv.character_avatar || undefined,
      }))
    : [demoConversation];

  // Calculate and update unread count whenever conversations change
  useEffect(() => {
    const totalUnread = conversations.reduce((sum, conv) => {
      return sum + (conv.unread || 0);
    }, 0);
    setUnreadCount(totalUnread);
  }, [conversations, setUnreadCount]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const togglePin = async (id: string) => {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation && id !== "demo-tamara") {
      await updateConversation(id, { is_pinned: !conversation.isPinned });
    }
  };

  const toggleArchive = async (id: string) => {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation && id !== "demo-tamara") {
      await updateConversation(id, { is_archived: !conversation.isArchived });
    }
    setShowArchived(false);
  };

  const deleteConversation = async (id: string) => {
    if (id !== "demo-tamara") {
      await deleteConv(id);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Si on affiche les archivées, montrer seulement les archivées
    if (showArchived) {
      return matchesSearch && conv.isArchived;
    }
    
    // Sinon, ne montrer que les non-archivées
    if (activeTab === "unread") {
      return matchesSearch && !conv.isRead && !conv.isArchived;
    }
    return matchesSearch && !conv.isArchived;
  });

  const pinnedConversations = filteredConversations
    .filter((conv) => conv.isPinned)
    .sort((a, b) => a.name.localeCompare(b.name));

  const unpinnedConversations = filteredConversations
    .filter((conv) => !conv.isPinned)
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedConversations = [...pinnedConversations, ...unpinnedConversations];

  const archivedCount = conversations.filter((conv) => conv.isArchived).length;

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-3 py-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Mes conversations</h1>
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
          >
            {isMuted ? (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Bell className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-card/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="pl-10 bg-secondary/50 border-border rounded-xl"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent gap-2 p-0 h-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm font-medium border border-border data-[state=inactive]:border-muted data-[state=inactive]:bg-transparent"
            >
              Toutes
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm font-medium border border-border data-[state=inactive]:border-muted data-[state=inactive]:bg-transparent"
            >
              Non lues
            </TabsTrigger>
          </TabsList>

          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2 mt-3 mb-2 ml-1 hover:opacity-80 transition-opacity"
          >
            <Archive className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Archivées {archivedCount > 0 && `(${archivedCount})`}
            </span>
          </button>

          <TabsContent value="all" className="mt-0">
            {showArchived && (
              <div className="mb-3 px-1">
                <p className="text-sm text-muted-foreground">
                  Conversations archivées
                </p>
              </div>
            )}
            <ConversationList
              conversations={sortedConversations}
              navigate={navigate}
              onTogglePin={togglePin}
              onArchive={toggleArchive}
              onUnarchive={toggleArchive}
              onDelete={deleteConversation}
              showArchived={showArchived}
              isAuthenticated={isAuthenticated}
              activeConversationId={activeConversationId}
              onOpenProfile={(imageUrl, name) => {
                setSelectedProfile({ imageUrl, name });
                setShowProfileModal(true);
              }}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            {showArchived && (
              <div className="mb-3 px-1">
                <p className="text-sm text-muted-foreground">
                  Conversations archivées
                </p>
              </div>
            )}
            <ConversationList
              conversations={sortedConversations}
              navigate={navigate}
              onTogglePin={togglePin}
              onArchive={toggleArchive}
              onUnarchive={toggleArchive}
              onDelete={deleteConversation}
              showArchived={showArchived}
              isAuthenticated={isAuthenticated}
              activeConversationId={activeConversationId}
              onOpenProfile={(imageUrl, name) => {
                setSelectedProfile({ imageUrl, name });
                setShowProfileModal(true);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ProfileImageModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedProfile(null);
        }}
        imageUrl={selectedProfile?.imageUrl}
        name={selectedProfile?.name || ""}
      />
    </div>
  );
};

interface ConversationListProps {
  conversations: Conversation[];
  navigate: ReturnType<typeof useNavigate>;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  showArchived: boolean;
  isAuthenticated: boolean;
  activeConversationId?: string;
  onOpenProfile: (imageUrl: string | undefined, name: string) => void;
}

const ConversationList = ({
  conversations,
  navigate,
  onTogglePin,
  onArchive,
  onUnarchive,
  onDelete,
  showArchived,
  isAuthenticated,
  activeConversationId,
  onOpenProfile,
}: ConversationListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">Aucune conversation</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv) => {
        const isActive = activeConversationId === conv.id;
        return (
        <div
          key={conv.id}
          className={`rounded-2xl transition-colors duration-200 animate-fade-in ${
            isActive 
              ? 'bg-primary/10 border border-primary/20' 
              : 'bg-card/30 hover:bg-[hsl(var(--conversation-hover))]'
          }`}
        >
          <div className="flex items-center gap-3 p-3">
            <button
              onClick={() => navigate(`/conversations/${conv.id}`, { 
                state: { 
                  preferences: { 
                    characterName: conv.name,
                    avatarUrl: conv.avatarUrl
                  } 
                } 
              })}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <Avatar 
                className="w-12 h-12 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProfile(conv.avatarUrl, conv.name);
                }}
              >
                {conv.avatarUrl && <AvatarImage src={conv.avatarUrl} alt={conv.name} />}
                <AvatarFallback className="bg-primary/20 text-primary text-base">
                  {conv.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                  <h3
                    className={`font-semibold text-foreground ${
                      !conv.isRead ? "font-bold" : "font-medium"
                    }`}
                  >
                    {conv.name}
                  </h3>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {conv.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm truncate ${
                      !conv.isRead
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {conv.lastMessage}
                  </p>
                  {(conv.unread ?? 0) > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>

            <div className="flex items-center gap-1 flex-shrink-0">
              {conv.isPinned && (
                <Pin className="w-4 h-4 text-muted-foreground" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-secondary/50 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {!showArchived && (
                    <DropdownMenuItem
                      onClick={() => onTogglePin(conv.id)}
                      className="gap-2"
                    >
                      <Pin className="w-4 h-4" />
                      {conv.isPinned ? "Désépingler" : "Épingler"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => showArchived ? onUnarchive(conv.id) : onArchive(conv.id)}
                    className="gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    {showArchived ? "Désarchiver" : "Archiver"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(conv.id)}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        );
      })}
      
      {/* Bouton Nouvelle conversation - toujours visible */}
      <div className="flex justify-center py-6 animate-fade-in">
        <Button
          onClick={() => navigate(isAuthenticated ? "/scenarios" : "/auth")}
          size="lg"
          className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle conversation
        </Button>
      </div>
    </div>
  );
};

export default Conversations;
