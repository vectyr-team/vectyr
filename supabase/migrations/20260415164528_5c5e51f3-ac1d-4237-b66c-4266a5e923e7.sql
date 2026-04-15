-- Drop the existing overly permissive SELECT policy on storage.objects for team-photos
DROP POLICY IF EXISTS "Public team photos are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view team photos" ON storage.objects;

-- Allow anyone to read individual files from team-photos (needed for photo URLs to work)
CREATE POLICY "Anyone can read team photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'team-photos');

-- Only admins can upload to team-photos
DROP POLICY IF EXISTS "Admins can upload team photos" ON storage.objects;
CREATE POLICY "Admins can upload team photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can update team photos
DROP POLICY IF EXISTS "Admins can update team photos" ON storage.objects;
CREATE POLICY "Admins can update team photos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can delete team photos
DROP POLICY IF EXISTS "Admins can delete team photos" ON storage.objects;
CREATE POLICY "Admins can delete team photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'));