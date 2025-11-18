import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, MoreVertical, Pin, Archive, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isPinned?: boolean;
  isRead?: boolean;
  isArchived?: boolean;
}

const Conversations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const demoConversation: Conversation = {
    id: "demo-tamara",
    name: "Tamara",
    lastMessage: "Bonjour.. ou salut je sais pas haha... Je viens d'emménager dans le quartier. Je connais pas grand monde en ville mais j'ai eu ton numéro par une amie. Ça te dérange pas si on continue à parler un peu :) ?",
    time: "Maintenant",
    unread: 1,
    isPinned: false,
    isRead: false,
  };

  const authenticatedConversations: Conversation[] = [
    {
      id: "1",
      name: "Sarah",
      lastMessage: "Je t'attends dans mon bureau...",
      time: "15:32",
      unread: 2,
      isPinned: true,
      isRead: false,
    },
    {
      id: "2",
      name: "Emma",
      lastMessage: "Tu as aimé notre conversation ?",
      time: "14:20",
      isPinned: false,
      isRead: true,
    },
    {
      id: "3",
      name: "Sofia",
      lastMessage: "À ce soir alors... 😘",
      time: "12:45",
      isPinned: true,
      isRead: false,
      unread: 1,
    },
  ];

  const [conversations, setConversations] = useState<Conversation[]>([demoConversation]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        setConversations(authenticatedConversations);
      } else {
        setConversations([demoConversation]);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        if (session) {
          setConversations(authenticatedConversations);
        } else {
          setConversations([demoConversation]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const togglePin = (id: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, isPinned: !conv.isPinned } : conv
      )
    );
  };

  const archiveConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, isArchived: true } : conv
      )
    );
  };

  const unarchiveConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, isArchived: false } : conv
      )
    );
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
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
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <PageHeader />

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
              onNavigate={navigate}
              onTogglePin={togglePin}
              onArchive={archiveConversation}
              onUnarchive={unarchiveConversation}
              onDelete={deleteConversation}
              showArchived={showArchived}
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
              onNavigate={navigate}
              onTogglePin={togglePin}
              onArchive={archiveConversation}
              onUnarchive={unarchiveConversation}
              onDelete={deleteConversation}
              showArchived={showArchived}
            />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

interface ConversationListProps {
  conversations: Conversation[];
  onNavigate: (path: string) => void;
  onTogglePin: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  showArchived: boolean;
}

const ConversationList = ({
  conversations,
  onNavigate,
  onTogglePin,
  onArchive,
  onUnarchive,
  onDelete,
  showArchived,
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
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className="rounded-2xl bg-card/30 hover:bg-[hsl(var(--conversation-hover))] transition-colors duration-200 animate-fade-in"
        >
          <div className="flex items-center gap-3 p-3">
            <button
              onClick={() => onNavigate(`/chat/${conv.id}`)}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <Avatar className="w-12 h-12 flex-shrink-0">
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
                  {conv.unread && (
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
      ))}
    </div>
  );
};

export default Conversations;
