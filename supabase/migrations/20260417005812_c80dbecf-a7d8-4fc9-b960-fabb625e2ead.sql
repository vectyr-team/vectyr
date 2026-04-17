CREATE TABLE public.glossary_terms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read glossary terms"
  ON public.glossary_terms FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert glossary terms"
  ON public.glossary_terms FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update glossary terms"
  ON public.glossary_terms FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete glossary terms"
  ON public.glossary_terms FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_glossary_terms_updated_at
  BEFORE UPDATE ON public.glossary_terms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.page_meta (page_slug, title, description)
VALUES ('glossary', 'Brand & BrandOS Glossary | Vectyr', 'Definitions of key brand strategy, BrandOS, and brand infrastructure terms used by Vectyr.')
ON CONFLICT DO NOTHING;