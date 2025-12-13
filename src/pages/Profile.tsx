import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Camera, 
  User, 
  Trash2, 
  Crown,
  MessageCircle,
  Heart,
  Users,
  Calendar,
  Clock,
  Shield,
  Bell,
  Palette,
  CreditCard,
  Lock,
  HelpCircle,
  Sparkles,
  Star,
  ChevronRight
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Le pseudonyme doit contenir au moins 3 caractères")
    .max(30, "Le pseudonyme ne peut pas dépasser 30 caractères")
    .optional()
    .or(z.literal("")),
  age: z
    .number()
    .min(18, "Vous devez avoir au moins 18 ans")
    .max(120, "Âge invalide")
    .optional(),
  sexual_orientation: z.string().optional(),
  gender: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      age: undefined,
      sexual_orientation: "",
      gender: "",
    },
  });

  useEffect(() => {
    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        if (session) {
          loadProfile();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          form.reset({
            username: profile.username || "",
            age: profile.age || undefined,
            sexual_orientation: profile.sexual_orientation || "",
            gender: profile.gender || "",
          });
          setAvatarUrl(profile.avatar_url);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: values.username || null,
          age: values.age || null,
          sexual_orientation: values.sexual_orientation || null,
          gender: values.gender || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      form.reset(values);
      
      toast.success("Profil enregistré avec succès");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success("Photo de profil mise à jour");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(error.message || "Erreur lors du téléchargement");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileError) throw profileError;

      await supabase.auth.signOut();

      toast.success("Compte supprimé avec succès");
      navigate("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Erreur lors de la suppression du compte");
    }
  };

  const stats = [
    { icon: MessageCircle, value: "12", label: "Conversations créées", gradient: "from-violet-500 to-purple-600" },
    { icon: Heart, value: "8", label: "Scénarios explorés", gradient: "from-pink-500 to-rose-600" },
    { icon: Users, value: "5", label: "Personnages essayés", gradient: "from-orange-400 to-amber-500" },
    { icon: Star, value: "3", label: "Scénarios favoris", gradient: "from-amber-400 to-yellow-500", filled: true },
  ];

  const settings = [
    { icon: Shield, label: "Sécurité", color: "from-violet-500 to-purple-600" },
    { icon: Bell, label: "Notifications", color: "from-pink-500 to-rose-600" },
    { icon: Palette, label: "Apparence", color: "from-orange-400 to-amber-500" },
    { icon: CreditCard, label: "Paiements & abonnements", color: "from-emerald-400 to-teal-500", onClick: () => navigate("/subscriptions") },
    { icon: Lock, label: "Confidentialité", color: "from-blue-400 to-indigo-500" },
    { icon: HelpCircle, label: "Centre d'aide", color: "from-cyan-400 to-sky-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <PageHeader />
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      <PageHeader />

      {/* Premium Hero Header with Gradient */}
      <div className="relative">
        {/* Background Gradient Layers */}
        <div 
          className="absolute inset-0 h-80"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 50% 0%, hsl(270 60% 25% / 0.6) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 30% 20%, hsl(330 80% 40% / 0.4) 0%, transparent 40%),
              radial-gradient(ellipse 80% 50% at 70% 30%, hsl(30 90% 55% / 0.25) 0%, transparent 35%),
              linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background)) 100%)
            `,
          }}
        />
        
        {/* Floating glow orbs */}
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-32 right-1/4 w-40 h-40 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        
        {/* Luminous top border */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, hsl(270 70% 60% / 0.6) 20%, hsl(330 85% 55% / 0.8) 50%, hsl(30 95% 60% / 0.6) 80%, transparent 100%)',
          }}
        />
      </div>

      {/* Main Content Container - Wide Desktop Layout */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {!isAuthenticated ? (
          <div className="space-y-8 animate-fade-in">
            {/* Non-authenticated Hero */}
            <div className="text-center py-12">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 rounded-full blur-2xl opacity-40 scale-150" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-violet-600/30 via-pink-500/20 to-amber-400/10 border border-white/10 backdrop-blur-xl flex items-center justify-center">
                  <User className="w-16 h-16 text-white/60" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Bienvenue sur Lydia</h2>
              <p className="text-muted-foreground mb-8">Connecte-toi pour accéder à ton espace personnel</p>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate("/auth")}
                  className="px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 hover:opacity-90 shadow-lg shadow-pink-500/25 transition-all hover:scale-105"
                >
                  Se connecter
                </Button>
                <Button 
                  onClick={() => navigate("/auth")}
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-2xl border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105"
                >
                  S'inscrire
                </Button>
              </div>
            </div>

            {/* Premium CTA for Non-Auth */}
            <PremiumCard navigate={navigate} />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Avatar Section - Premium Header */}
            <div className="text-center py-8">
              <div className="relative inline-block group">
                {/* Diffuse glow behind avatar */}
                <div 
                  className="absolute inset-0 scale-150 rounded-full blur-3xl opacity-60 transition-opacity group-hover:opacity-80"
                  style={{
                    background: 'radial-gradient(circle, hsl(330 80% 50% / 0.5) 0%, hsl(270 70% 50% / 0.3) 50%, transparent 70%)',
                  }}
                />
                
                <Avatar className="relative w-36 h-36 border-4 border-white/20 shadow-2xl ring-2 ring-pink-500/30 ring-offset-4 ring-offset-background transition-transform group-hover:scale-105">
                  {avatarUrl && (
                    <AvatarImage
                      src={avatarUrl}
                      alt="Profile"
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-violet-600/40 via-pink-500/30 to-amber-400/20 text-foreground text-5xl font-light">
                    {form.getValues("username")?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                {/* Camera button */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-1 right-1 p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full cursor-pointer hover:scale-110 transition-all shadow-lg shadow-pink-500/30"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Username & Badge */}
              <div className="mt-6 space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {form.getValues("username") || "Utilisateur"}
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium text-amber-300">Membre</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Ton espace Lydia personnel</p>
              </div>
            </div>

            {/* Identity Form - Glassmorphism Card */}
            <div 
              className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl border border-white/10 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, hsl(270 30% 15% / 0.6) 0%, hsl(330 20% 12% / 0.4) 50%, hsl(30 20% 10% / 0.3) 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-violet-500/20 to-pink-500/20">
                  <User className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Identité</h3>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-sm flex items-center gap-2">
                            <User className="w-4 h-4 text-pink-400/60" />
                            Pseudonyme
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ton pseudonyme"
                              className="h-12 rounded-xl bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:border-pink-500/50 focus:ring-pink-500/20 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-sm flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-pink-400/60" />
                            Âge
                          </FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-foreground focus:border-pink-500/50 focus:ring-pink-500/20">
                                <SelectValue placeholder="Sélectionner ton âge" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 max-h-[300px] z-50">
                              {Array.from({ length: 83 }, (_, i) => i + 18).map((age) => (
                                <SelectItem key={age} value={age.toString()}>
                                  {age} ans
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-sm flex items-center gap-2">
                            <Users className="w-4 h-4 text-pink-400/60" />
                            Genre
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-foreground focus:border-pink-500/50 focus:ring-pink-500/20">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10">
                              <SelectItem value="homme">Homme</SelectItem>
                              <SelectItem value="femme">Femme</SelectItem>
                              <SelectItem value="non-binaire">Non-binaire</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sexual_orientation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 text-sm flex items-center gap-2">
                            <Heart className="w-4 h-4 text-pink-400/60" />
                            Orientation
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 text-foreground focus:border-pink-500/50 focus:ring-pink-500/20">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10">
                              <SelectItem value="hetero">Hétérosexuel(le)</SelectItem>
                              <SelectItem value="gay">Gay</SelectItem>
                              <SelectItem value="bi">Bisexuel(le)</SelectItem>
                              <SelectItem value="pan">Pansexuel(le)</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      type="submit"
                      className="px-12 py-6 text-base rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 hover:opacity-90 shadow-lg shadow-pink-500/25 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      disabled={!form.formState.isDirty}
                    >
                      {form.formState.isDirty ? "Enregistrer" : "Modifier"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Statistics Grid - Glassmorphism Cards */}
            <div 
              className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl border border-white/10 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, hsl(270 30% 15% / 0.6) 0%, hsl(330 20% 12% / 0.4) 50%, hsl(30 20% 10% / 0.3) 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-violet-500/20 to-pink-500/20">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Statistiques</h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-all hover:scale-105 hover:shadow-lg hover:shadow-pink-500/10"
                  >
                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/0 to-violet-500/0 group-hover:from-pink-500/5 group-hover:to-violet-500/5 transition-all" />
                    
                    <div className="relative">
                      <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-r ${stat.gradient} mb-3`}>
                        <stat.icon className={`w-5 h-5 text-white ${stat.filled ? 'fill-white' : ''}`} />
                      </div>
                      <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Dernière activité</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Membre depuis</p>
                    <p className="text-xs text-muted-foreground">Janvier 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Card */}
            <PremiumCard navigate={navigate} />

            {/* Settings Grid */}
            <div 
              className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl border border-white/10 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, hsl(270 30% 15% / 0.6) 0%, hsl(330 20% 12% / 0.4) 50%, hsl(30 20% 10% / 0.3) 100%)',
              }}
            >
              <h3 className="text-xl font-semibold text-foreground mb-6">Paramètres du compte</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {settings.map((setting, index) => (
                  <button 
                    key={index}
                    onClick={setting.onClick}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 hover:bg-white/10 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/5"
                  >
                    <div className={`p-2.5 rounded-xl bg-gradient-to-r ${setting.color} transition-transform group-hover:scale-110`}>
                      <setting.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-foreground font-medium flex-1 text-left">{setting.label}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-pink-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Se déconnecter
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all"
                  >
                    <Trash2 className="w-5 h-5 mr-3" />
                    Supprimer mon compte
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-white/10 rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">
                      Êtes-vous absolument sûr ?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      Cette action est irréversible. Toutes vos données seront
                      définitivement supprimées.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl bg-white/5 border-white/10 text-foreground hover:bg-white/10">
                      Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="rounded-xl bg-rose-500 text-white hover:bg-rose-600"
                    >
                      Supprimer définitivement
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

// SVG Logo component for Premium badge with gold glow
const LydiaGoldLogo = ({ className = "w-10 h-10" }: { className?: string }) => {
  // Import dynamically to avoid circular deps
  const logoSrc = "/lydia-logo.png";
  return (
    <div className={`relative ${className}`}>
      <img 
        src={logoSrc} 
        alt="Lydia Premium" 
        className="w-full h-full object-contain"
        style={{
          filter: 'brightness(1.2) sepia(1) hue-rotate(10deg) saturate(1.5)',
        }}
      />
    </div>
  );
};

// Premium Card Component
const PremiumCard = ({ navigate }: { navigate: (path: string) => void }) => (
  <div 
    onClick={() => navigate("/subscriptions")}
    className="group relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl"
    style={{
      background: `
        linear-gradient(135deg, 
          hsl(45 100% 35% / 0.3) 0%, 
          hsl(35 100% 45% / 0.2) 30%,
          hsl(25 100% 50% / 0.15) 60%,
          hsl(15 80% 40% / 0.1) 100%
        )
      `,
      border: '1px solid hsl(45 90% 50% / 0.3)',
      boxShadow: '0 0 60px hsl(45 100% 50% / 0.15), inset 0 1px 1px hsl(45 100% 80% / 0.2)',
    }}
  >
    {/* Shimmer effect on hover */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    
    {/* Content */}
    <div className="relative z-10 text-center space-y-4">
      <div className="flex justify-center">
        <div 
          className="p-4 rounded-2xl shadow-lg"
          style={{
            background: 'linear-gradient(135deg, hsl(45 100% 55%) 0%, hsl(35 100% 50%) 100%)',
            boxShadow: '0 8px 32px hsl(45 100% 50% / 0.4)',
          }}
        >
          <LydiaGoldLogo className="w-10 h-10" />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Premium
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Accès illimité aux scénarios Fantasy, messages et photos sans restriction
        </p>
      </div>
      
      {/* Subscription Status (for authenticated users) */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs text-muted-foreground">Statut : <span className="text-amber-400 font-semibold">Gratuit</span></p>
      </div>
      
      <Button 
        className="px-8 py-6 text-base rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Gérer mon abonnement
      </Button>
    </div>
  </div>
);

export default Profile;
