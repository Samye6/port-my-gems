import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Nouvelle conversation",
      description: "Choisissez un scénario et commencez",
      action: () => navigate("/scenarios"),
      gradient: "from-primary/20 to-primary/5",
    },
    {
      icon: Sparkles,
      title: "Mes conversations",
      description: "Reprendre là où vous vous êtes arrêté",
      action: () => navigate("/conversations"),
      gradient: "from-accent/20 to-accent/5",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <PageHeader />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-primary/10 p-6 rounded-2xl border border-primary/20">
              <MessageCircle className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Bienvenue sur Lydia</h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Des conversations immersives et sensuelles avec une IA réaliste
          </p>
        </div>

        {/* Quick Actions */}
        <div className="w-full max-w-md space-y-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`w-full p-6 rounded-2xl bg-gradient-to-br ${action.gradient} border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 text-left animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
