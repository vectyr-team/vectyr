DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'team_grid_settings'
      AND policyname = 'Anyone can read team grid settings'
  ) THEN
    CREATE POLICY "Anyone can read team grid settings"
    ON public.team_grid_settings
    FOR SELECT
    TO public
    USING (true);
  END IF;
END
$$;