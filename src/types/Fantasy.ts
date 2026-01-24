// Interface unique pour les fantasies Supabase
// IMPORTANT: Utiliser EXACTEMENT les noms de colonnes snake_case de Supabase
export interface Fantasy {
  // Identifiant interne (normalisé depuis slug)
  id: string;
  
  // Champs Supabase (snake_case)
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  badge: string | null;
  badge_type: "trending" | "premium" | "new" | "verified" | "vip" | null;
  photos: number;
  videos: number;
  likes: number;
  dislikes: number;
  
  // Données personnage (snake_case - de Supabase)
  character_name: string | null;
  character_age: number | null;
  personality_tags: string[] | null;
  
  // Champs UI calculés localement
  gradient: string;
  icon: React.ReactNode;
  image?: string;
  isOnline?: boolean;
  
  // Champs UI dérivés
  emotionalSubtitle: string;
  sexyTagline: string;
  detailedDescription: string;
}
