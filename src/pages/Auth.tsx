import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import heroModel from "@/assets/hero-model.png";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/profile");
      }
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Lydia !",
        });
        navigate("/profile");
      } else {
        if (password !== confirmPassword) {
          toast({
            title: "Erreur",
            description: "Les mots de passe ne correspondent pas",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/profile`,
          },
        });

        if (error) throw error;

        toast({
          title: "Compte créé",
          description: "Bienvenue sur Lydia ! Vous pouvez maintenant compléter votre profil.",
        });
        navigate("/profile");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Immersive gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f0f23]" />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2), transparent 70%)',
        }}
      />
      
      {/* Secondary glow */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 70% 60%, rgba(255, 77, 141, 0.25), rgba(251, 191, 146, 0.15), transparent 60%)',
        }}
      />

      {/* Blurred model image as texture */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: 0.15,
        }}
      >
        <img 
          src={heroModel} 
          alt="" 
          className="h-[120%] w-auto object-cover"
          style={{
            filter: 'blur(40px) saturate(1.2)',
            maskImage: 'radial-gradient(ellipse 70% 70% at center, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at center, black 20%, transparent 70%)',
          }}
        />
      </div>

      {/* Ghost message bubbles - very subtle */}
      <div 
        className="absolute top-[15%] left-[10%] px-4 py-2 rounded-2xl pointer-events-none animate-float-gentle"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(8px)',
          opacity: 0.06,
          animationDelay: '0s',
        }}
      >
        <span className="text-white/60 text-sm">Hey… tu m'as manqué 😏</span>
      </div>
      
      <div 
        className="absolute bottom-[25%] right-[8%] px-3 py-1.5 rounded-2xl pointer-events-none animate-float-gentle"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(6px)',
          opacity: 0.05,
          animationDelay: '2s',
        }}
      >
        <span className="text-white/50 text-xs">Je pense à toi…</span>
      </div>

      {/* Back button */}
      <div className="relative z-10 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 text-white/80" />
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <div 
          className={`w-full max-w-md space-y-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Logo with halo */}
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-20 h-20">
              {/* Outer glow */}
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 77, 141, 0.4) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%)',
                  filter: 'blur(20px)',
                  transform: 'scale(2)',
                }}
              />
              {/* Icon container */}
              <div className="relative bg-gradient-to-br from-primary/20 to-violet-500/20 p-5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-[0_0_40px_rgba(255,77,141,0.3)]">
                <Heart className="w-10 h-10 text-primary fill-primary drop-shadow-[0_0_10px_rgba(255,77,141,0.5)]" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                {isLogin ? "Connexion" : "Créer un compte"}
              </h1>
              <p className="text-white/60 text-sm">
                {isLogin
                  ? "Connectez-vous pour continuer vos conversations"
                  : "Rejoignez Lydia pour des conversations sans limites"}
              </p>
            </div>
          </div>

          {/* Glassmorphism form container */}
          <div 
            className="relative p-8 rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 60px rgba(255, 77, 141, 0.1)',
            }}
          >
            {/* Form halo */}
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1), transparent 70%)',
              }}
            />

            <form onSubmit={handleAuth} className="relative space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80 text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 backdrop-blur-sm transition-all duration-300 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,77,141,0.2)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80 text-sm font-medium">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 backdrop-blur-sm transition-all duration-300 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,77,141,0.2)]"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="confirmPassword" className="text-white/80 text-sm font-medium">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 backdrop-blur-sm transition-all duration-300 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,77,141,0.2)]"
                  />
                </div>
              )}

              {/* Premium CTA button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl text-white font-semibold text-base transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #FF4D8D 0%, #8B5CF6 100%)',
                  boxShadow: '0 4px 20px rgba(255, 77, 141, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
                }}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Chargement...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>{isLogin ? "Se connecter" : "Créer mon compte"}</span>
                  </div>
                )}
              </Button>
            </form>
          </div>

          {/* Toggle login/signup */}
          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-white/50 hover:text-primary transition-colors duration-300 hover:drop-shadow-[0_0_10px_rgba(255,77,141,0.5)]"
            >
              {isLogin
                ? "Pas encore de compte ? S'inscrire"
                : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(15, 15, 35, 0.8), transparent)',
        }}
      />
    </div>
  );
};

export default Auth;
