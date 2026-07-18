
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view social links"
  ON public.social_links FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert social links"
  ON public.social_links FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update social links"
  ON public.social_links FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete social links"
  ON public.social_links FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.social_links (label, icon, href, sort_order) VALUES
  ('YouTube', 'mdi:youtube', 'https://www.youtube.com/@vectyrbrands', 0),
  ('Behance', 'mdi:behance', 'https://www.behance.net/vectyr', 1),
  ('LinkedIn', 'mdi:linkedin', 'https://www.linkedin.com/in/stevereedbrands', 2),
  ('Instagram', 'mdi:instagram', 'https://instagram.com/stevereedbrands', 3);
