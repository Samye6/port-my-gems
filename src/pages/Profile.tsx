import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Crown, LogOut, Camera, User, Trash2 } from "lucide-react";
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
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

      toast.success("Profil mis à jour avec succès");
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

      <div className="p-4 space-y-6">
        {/* User Identity Card */}
        <Card className="p-6 bg-card border-border animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Identité
            </h3>
          </div>

          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                {avatarUrl && <AvatarImage src={avatarUrl} />}
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {form.watch("username")?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-4 h-4 text-primary-foreground" />
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
            {uploading && (
              <p className="text-xs text-muted-foreground">
                Téléchargement...
              </p>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pseudonyme</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Votre pseudonyme"
                        {...field}
                        className="bg-secondary border-border"
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
                    <FormLabel>Âge (18+ requis)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Votre âge"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                        value={field.value || ""}
                        className="bg-secondary border-border"
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
                    <FormLabel>Sexe / Genre</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="homme">Homme</SelectItem>
                        <SelectItem value="femme">Femme</SelectItem>
                        <SelectItem value="non-binaire">Non-binaire</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Préfère ne pas dire
                        </SelectItem>
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
                    <FormLabel>Orientation & préférences</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="hetero">Hétérosexuel(le)</SelectItem>
                        <SelectItem value="gay">Gay</SelectItem>
                        <SelectItem value="lesbian">Lesbienne</SelectItem>
                        <SelectItem value="bi">Bisexuel(le)</SelectItem>
                        <SelectItem value="pan">Pansexuel(le)</SelectItem>
                        <SelectItem value="queer">Queer</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Préfère ne pas dire
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Enregistrer
              </Button>
            </form>
          </Form>
        </Card>

        {/* Account Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start border-border hover:bg-secondary/50"
            onClick={() => navigate("/premium")}
          >
            <Crown className="w-5 h-5 mr-3 text-primary" />
            Passer Premium
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-border hover:bg-secondary/50"
          >
            <Settings className="w-5 h-5 mr-3" />
            Paramètres
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Se déconnecter
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start border-destructive text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Supprimer mon compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Cette action est irréversible. Toutes vos données, conversations
                  et paramètres seront définitivement supprimés.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-border">
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

      <BottomNav />
    </div>
  );
};

export default Profile;
