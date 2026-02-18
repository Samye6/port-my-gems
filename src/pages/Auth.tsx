import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import authModel from "@/assets/auth-model.png";
import lydiaLogo from "@/assets/lydia-logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de se connecter avec Google",
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Immersive gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f0f23]" />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 60% 50%, rgba(139, 92, 246, 0.35), rgba(236, 72, 153, 0.25), transparent 60%)',
        }}
      />
      
      {/* Secondary glow for peach accent */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 75% 70%, rgba(255, 77, 141, 0.3), rgba(251, 191, 146, 0.2), transparent 50%)',
        }}
      />

      {/* Model image with blur and halo integration */}
      <div 
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        style={{
          opacity: 0.35,
        }}
      >
        {/* Model halo glow */}
        <div 
          className="absolute bottom-0 right-[10%] w-[600px] h-[700px]"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 70%, rgba(139, 92, 246, 0.4), rgba(255, 77, 141, 0.25), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <img 
          src={authModel} 
          alt="" 
          className="h-[85%] w-auto object-contain object-bottom"
          style={{
            filter: 'blur(2px) saturate(1.1) brightness(0.95)',
            maskImage: 'linear-gradient(to top, black 30%, transparent 95%), linear-gradient(to right, transparent 5%, black 30%, black 70%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 95%)',
            marginRight: '-15%',
          }}
        />
      </div>

      {/* Ghost message bubbles around model */}
      <div 
        className="absolute top-[20%] right-[12%] px-4 py-2.5 rounded-2xl pointer-events-none"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(12px)',
          opacity: 0.08,
          animation: 'float-gentle 6s ease-in-out infinite',
          boxShadow: '0 0 30px rgba(214, 123, 255, 0.15), 0 0 60px rgba(255, 108, 168, 0.1)',
        }}
      >
        <span className="text-white/70 text-sm font-light">Hey… tu m'as manqué 😏</span>
      </div>
      
      <div 
        className="absolute top-[35%] right-[5%] px-3.5 py-2 rounded-2xl pointer-events-none"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          opacity: 0.07,
          animation: 'float-gentle 7s ease-in-out infinite',
          animationDelay: '2s',
          boxShadow: '0 0 25px rgba(214, 123, 255, 0.12)',
        }}
      >
        <span className="text-white/60 text-xs font-light">Je pense encore à toi…</span>
      </div>

      <div 
        className="absolute bottom-[35%] right-[18%] px-3 py-1.5 rounded-xl pointer-events-none"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(8px)',
          opacity: 0.06,
          animation: 'float-gentle 8s ease-in-out infinite',
          animationDelay: '4s',
          boxShadow: '0 0 20px rgba(255, 108, 168, 0.1)',
        }}
      >
        <span className="text-white/50 text-xs font-light">Tu es prêt ? ✨</span>
      </div>

      {/* Ghost bubble around form - top left */}
      <div 
        className="absolute top-[22%] left-[8%] px-3 py-1.5 rounded-xl pointer-events-none hidden lg:block"
        style={{
          background: 'rgba(255, 255, 255, 0.015)',
          backdropFilter: 'blur(20px)',
          opacity: 0.06,
          animation: 'float-gentle 9s ease-in-out infinite',
          animationDelay: '1s',
        }}
      >
        <span className="text-white/40 text-xs font-light">…</span>
      </div>

      {/* Ghost bubble around form - bottom right */}
      <div 
        className="absolute bottom-[20%] left-[35%] px-3 py-1.5 rounded-xl pointer-events-none hidden lg:block"
        style={{
          background: 'rgba(255, 255, 255, 0.01)',
          backdropFilter: 'blur(25px)',
          opacity: 0.05,
          animation: 'float-gentle 10s ease-in-out infinite',
          animationDelay: '3s',
        }}
      >
        <span className="text-white/30 text-xs font-light">Reviens-moi…</span>
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
          {/* Lydia Logo with halo */}
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-24 h-24">
              {/* Outer glow halo - violet → rose → peach */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(139, 92, 246, 0.5), rgba(255, 77, 141, 0.4), rgba(251, 191, 146, 0.3), rgba(139, 92, 246, 0.5))',
                  filter: 'blur(30px)',
                  transform: 'scale(2.5)',
                  animation: 'pulse 4s ease-in-out infinite',
                }}
              />
              {/* Secondary glow layer */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 77, 141, 0.6) 0%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)',
                  filter: 'blur(20px)',
                  transform: 'scale(1.8)',
                }}
              />
              {/* Logo container */}
              <div className="relative flex items-center justify-center h-full">
                <img 
                  src={lydiaLogo} 
                  alt="Lydia" 
                  className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(255,77,141,0.5)]"
                  style={{
                    filter: 'brightness(1.1) drop-shadow(0 0 15px rgba(255, 77, 141, 0.4))',
                  }}
                />
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
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 80px rgba(139, 92, 246, 0.1), 0 0 120px rgba(255, 77, 141, 0.08)',
            }}
          >
            {/* Form halo */}
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08), rgba(255, 77, 141, 0.05), transparent 70%)',
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

              {/* Premium CTA button - clean, no icon */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl text-white font-semibold text-base transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 border-0"
                style={{
                  background: 'linear-gradient(135deg, #FF4D8D 0%, #8B5CF6 100%)',
                  boxShadow: '0 4px 24px rgba(255, 77, 141, 0.45), 0 0 50px rgba(139, 92, 246, 0.25)',
                }}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Chargement...</span>
                  </div>
                ) : (
              <span>{isLogin ? "Se connecter" : "Créer mon compte"}</span>
                )}
              </Button>

              {/* Separator */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
                <span className="text-white/40 text-xs font-light tracking-widest">ou</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
              </div>

              {/* Google Auth Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={googleLoading}
                className="w-full h-12 rounded-xl flex items-center justify-center gap-3 text-white/90 text-sm font-medium transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span>Continuer avec Google</span>
              </button>
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
          background: 'linear-gradient(to top, rgba(15, 15, 35, 0.9), transparent)',
        }}
      />

      {/* CSS for float animation */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
};

export default Auth;
