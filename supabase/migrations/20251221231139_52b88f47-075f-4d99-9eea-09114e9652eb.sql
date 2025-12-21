-- Create fantasies table for scenarios
CREATE TABLE public.fantasies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  gradient TEXT,
  badge TEXT,
  badge_type TEXT,
  photos INTEGER DEFAULT 0,
  videos INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fantasies ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active fantasies
CREATE POLICY "Anyone can view active fantasies"
ON public.fantasies
FOR SELECT
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_fantasies_updated_at
BEFORE UPDATE ON public.fantasies
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial data for the 5 launch scenarios
INSERT INTO public.fantasies (slug, title, tagline, description, is_active, gradient, badge, badge_type, photos, videos, likes, dislikes, sort_order) VALUES
('collegue', 'Collègue', 'Regards complices', 'Tension au bureau', true, 'from-red-700/25 via-orange-500/15 to-amber-500/20', 'Recommandé', 'trending', 45, 8, 890, 52, 1),
('fit-girl', 'La Fit Girl', 'Corps sculpté', 'Énergie et sensualité', true, 'from-red-700/25 via-orange-500/15 to-amber-500/20', 'Populaire', 'trending', 65, 14, 1180, 42, 2),
('universitaire', 'Universitaire', 'Innocence trompeuse', 'Étudiante coquine', true, 'from-pink-600/25 via-rose-400/15 to-red-400/20', NULL, 'new', 48, 9, 1050, 47, 3),
('policiere', 'Policière', 'Loi et désir', 'Autorité séduisante', true, 'from-blue-900/25 via-indigo-600/15 to-purple-500/20', NULL, 'trending', 52, 10, 1120, 58, 4),
('professeure', 'Professeure', 'Leçons particulières', 'Enseignement privé', true, 'from-amber-600/25 via-orange-400/15 to-yellow-400/20', NULL, 'new', 46, 8, 980, 51, 5);