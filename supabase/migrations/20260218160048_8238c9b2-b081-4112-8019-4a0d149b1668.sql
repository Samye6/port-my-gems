
-- Create character_photos table
CREATE TABLE public.character_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fantasy_slug TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.character_photos ENABLE ROW LEVEL SECURITY;

-- Public read access (photos are public content)
CREATE POLICY "Anyone can view character photos"
  ON public.character_photos
  FOR SELECT
  USING (true);

-- Create index for fast lookup by slug
CREATE INDEX idx_character_photos_slug ON public.character_photos (fantasy_slug);

-- Create the character-photos storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-photos', 'character-photos', true);

-- Public read access for the bucket
CREATE POLICY "Character photos are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'character-photos');

-- Admin upload policy (service role only via Cloud backend)
CREATE POLICY "Service role can upload character photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'character-photos');

CREATE POLICY "Service role can update character photos"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'character-photos');

CREATE POLICY "Service role can delete character photos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'character-photos');
