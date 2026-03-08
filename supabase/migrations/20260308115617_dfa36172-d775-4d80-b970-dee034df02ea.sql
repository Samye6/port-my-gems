
DROP POLICY IF EXISTS "Anyone can view fantasy characters" ON public.fantasy_characters;
CREATE POLICY "Anyone can view fantasy characters"
  ON public.fantasy_characters
  FOR SELECT
  TO anon, authenticated
  USING (true);
