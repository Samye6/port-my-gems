
CREATE TABLE public.fantasy_characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  card_title TEXT NOT NULL,
  card_subtitle TEXT NOT NULL,
  recommended BOOLEAN NOT NULL DEFAULT false,
  personality_tags TEXT[] DEFAULT '{}',
  encounter_preview TEXT NOT NULL,
  starter_cta TEXT NOT NULL,
  openness INTEGER NOT NULL DEFAULT 50,
  content_access_difficulty INTEGER NOT NULL DEFAULT 50,
  pace INTEGER NOT NULL DEFAULT 50,
  depth INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS: public read access
ALTER TABLE public.fantasy_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view fantasy characters"
  ON public.fantasy_characters
  FOR SELECT
  USING (true);

-- Auto-update updated_at
CREATE TRIGGER handle_fantasy_characters_updated_at
  BEFORE UPDATE ON public.fantasy_characters
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
