-- Add character data columns to fantasies table
ALTER TABLE public.fantasies 
ADD COLUMN IF NOT EXISTS character_name text,
ADD COLUMN IF NOT EXISTS character_age integer,
ADD COLUMN IF NOT EXISTS personality_tags text[];

-- Update existing rows with default character data
UPDATE public.fantasies SET 
  character_name = 'Clara',
  character_age = 27,
  personality_tags = ARRAY['Discrète', 'Intelligente', 'Provocatrice subtile']
WHERE slug = 'collegue';

UPDATE public.fantasies SET 
  character_name = 'Jade',
  character_age = 24,
  personality_tags = ARRAY['Énergique', 'Directe', 'Taquine', 'Confiante']
WHERE slug = 'fit-girl';

UPDATE public.fantasies SET 
  character_name = 'Léa',
  character_age = 21,
  personality_tags = ARRAY['Curieuse', 'Joueuse', 'Maligne']
WHERE slug = 'universitaire';

UPDATE public.fantasies SET 
  character_name = 'Eva',
  character_age = 29,
  personality_tags = ARRAY['Autoritaire', 'Calme', 'Dominante']
WHERE slug = 'policiere';

UPDATE public.fantasies SET 
  character_name = 'Nathalie',
  character_age = 34,
  personality_tags = ARRAY['Élégante', 'Intellectuelle', 'Troublée']
WHERE slug = 'professeure';