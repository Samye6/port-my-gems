import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
}

const Conversations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Sarah",
      lastMessage: "Je t'attends dans mon bureau...",
      time: "Il y a 5 min",
      unread: 2,
    },
    {
      id: "2",
      name: "Emma",
      lastMessage: "Tu as aimé notre conversation ?",
      time: "Il y a 1h",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <PageHeader />

      {/* Search Bar */}
      <div className="px-4 py-4 bg-card/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une conversation..."
            className="pl-10 bg-secondary border-border"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Aucune conversation
            </h3>
            <p className="text-muted-foreground mb-6">
              Commencez une nouvelle conversation pour découvrir Lydia
            </p>
            <Button
              onClick={() => navigate("/scenarios")}
              className="bg-primary hover:bg-primary/90"
            >
              Nouvelle conversation
            </Button>
          </div>
        ) : (
          <div>
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => navigate(`/chat/${conv.id}`)}
                className="w-full p-4 flex items-center gap-4 border-b border-border hover:bg-secondary/50 transition-all duration-300 animate-fade-in"
              >
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-primary/20 text-primary text-lg">
                    {conv.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{conv.name}</h3>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {conv.lastMessage}
                    </p>
                    {conv.unread && (
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FAB Button */}
      <button
        onClick={() => navigate("/scenarios")}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 z-40"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </button>

      <BottomNav />
    </div>
  );
};

export default Conversations;
