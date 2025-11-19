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
  Sparkles
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

      // Reset form state to mark it as not dirty
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

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with avatar URL
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

      // Supprimer le profil
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Déconnecter l'utilisateur
      await supabase.auth.signOut();

      toast.success("Compte supprimé avec succès");
      navigate("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Erreur lors de la suppression du compte");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <PageHeader />
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader />

      {/* Gradient Background */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#FF4D8D]/20 via-purple-500/10 to-transparent pointer-events-none" />

      <div className="relative p-4 space-y-6 max-w-2xl mx-auto">
        {!isAuthenticated ? (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-card border-border rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Identité
                </h3>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Connecte-toi pour accéder à ton profil
                </p>
                
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => navigate("/auth")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Se connecter
                  </Button>
                  <Button 
                    onClick={() => navigate("/auth")}
                    variant="outline"
                  >
                    S'inscrire
                  </Button>
                </div>
              </div>
            </Card>

            {/* Premium Section for Non-Authenticated */}
            <Card className="p-6 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20 border-amber-500/30 rounded-2xl shadow-xl">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <Crown className="w-12 h-12 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Passe Premium
                </h3>
                <p className="text-sm text-muted-foreground">
                  Débloque les scénarios exclusifs, les collaborations vérifiées et les expériences limitées.
                </p>
                <Button 
                  onClick={() => navigate("/premium")}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold"
                >
                  Découvrir Premium
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* 1. IDENTITÉ */}
            <Card className="p-8 bg-card border-border rounded-2xl shadow-lg">
              <div className="flex flex-col items-center space-y-4">
                {/* Avatar avec halo rose */}
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF4D8D] to-pink-400 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                  <Avatar className="relative w-32 h-32 border-4 border-[#FF4D8D]/30">
                    {avatarUrl && (
                      <AvatarImage
                        src={avatarUrl}
                        alt="Profile"
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-primary/20 text-primary text-4xl">
                      {form.getValues("username")?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
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

                {/* Form Fields */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Pseudonyme</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ton pseudonyme"
                              className="bg-background border-border text-foreground"
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
                          <FormLabel className="text-foreground">Âge</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="18+"
                              className="bg-background border-border text-foreground"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Genre</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                          <FormLabel className="text-foreground">Orientation</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={!form.formState.isDirty}
                    >
                      {form.formState.isDirty ? "Enregistrer" : "Modifié"}
                    </Button>
                  </form>
                </Form>
              </div>
            </Card>

            {/* 2. SECTION PREMIUM */}
            <Card className="p-6 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20 border-amber-500/30 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Passe Premium
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Débloque les scénarios exclusifs, les collaborations vérifiées et les expériences limitées.
                </p>
                <Button 
                  onClick={() => navigate("/premium")}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold shadow-lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Découvrir Premium
                </Button>
              </div>
            </Card>

            {/* 3. STATISTIQUES DU COMPTE */}
            <Card className="p-6 bg-card border-border rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Statistiques du compte
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold text-foreground">12</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Conversations créées</p>
                </div>

                <div className="p-4 bg-background/50 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold text-foreground">8</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Scénarios explorés</p>
                </div>

                <div className="p-4 bg-background/50 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold text-foreground">5</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Personnages essayés</p>
                </div>

                <div className="p-4 bg-background/50 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-2xl font-bold text-foreground">3</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Scénarios favoris</p>
                </div>

                <div className="p-4 bg-background/50 rounded-xl border border-border/50 col-span-2">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Dernière activité</p>
                      <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background/50 rounded-xl border border-border/50 col-span-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Membre depuis</p>
                      <p className="text-xs text-muted-foreground">Janvier 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 4. PARAMÈTRES DU COMPTE */}
            <Card className="p-6 bg-card border-border rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Paramètres du compte
              </h3>
              
              <div className="space-y-3">
                <button className="w-full p-4 bg-background/50 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-background transition-all flex items-center gap-3 group">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Sécurité</span>
                </button>

                <button className="w-full p-4 bg-background/50 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-background transition-all flex items-center gap-3 group">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Notifications</span>
                </button>

                <button className="w-full p-4 bg-background/50 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-background transition-all flex items-center gap-3 group">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Palette className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Apparence</span>
                </button>

                <button 
                  onClick={() => navigate("/premium")}
                  className="w-full p-4 bg-background/50 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-background transition-all flex items-center gap-3 group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Paiements & abonnements</span>
                </button>

                <button className="w-full p-4 bg-background/50 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-background transition-all flex items-center gap-3 group">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Confidentialité</span>
                </button>

                <button className="w-full p-4 bg-background/50 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-background transition-all flex items-center gap-3 group">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Centre d'aide</span>
                </button>
              </div>
            </Card>

            {/* 5. DANGER ZONE */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-muted-foreground/20 text-muted-foreground hover:bg-muted/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer mon compte
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
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
                    <AlertDialogCancel className="bg-background border-border text-foreground hover:bg-muted">
                      Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

export default Profile;
