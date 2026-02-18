-- Create user-photos bucket for user-uploaded ephemeral photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-photos', 'user-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for user-photos bucket
CREATE POLICY "Authenticated users can upload their own photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view user photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'user-photos');

CREATE POLICY "Users can delete their own uploaded photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);