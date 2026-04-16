INSERT INTO storage.buckets (id, name, public) VALUES ('og-images', 'og-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "OG images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'og-images');

CREATE POLICY "Admins can upload OG images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'og-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update OG images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'og-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete OG images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'og-images' AND has_role(auth.uid(), 'admin'::app_role));