
-- Drop and recreate the upload policy with proper path handling
DROP POLICY IF EXISTS "Admins can upload team photos" ON storage.objects;
CREATE POLICY "Admins can upload team photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update team photos" ON storage.objects;
CREATE POLICY "Admins can update team photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete team photos" ON storage.objects;
CREATE POLICY "Admins can delete team photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'::public.app_role));
