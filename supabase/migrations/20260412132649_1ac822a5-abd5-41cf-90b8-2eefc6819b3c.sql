
-- Create page_settings table to store embed codes and other settings per page
CREATE TABLE public.page_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  page_name TEXT NOT NULL,
  form_embed_code TEXT,
  form_script_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read page settings (needed for public pages to load embed codes)
CREATE POLICY "Anyone can read page settings"
  ON public.page_settings FOR SELECT
  USING (true);

-- Only authenticated users can update page settings
CREATE POLICY "Authenticated users can update page settings"
  ON public.page_settings FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can insert page settings
CREATE POLICY "Authenticated users can insert page settings"
  ON public.page_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_page_settings_updated_at
  BEFORE UPDATE ON public.page_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with current embed codes
INSERT INTO public.page_settings (page_slug, page_name, form_embed_code, form_script_url) VALUES
  ('demo', 'Demo', 'https://links.vectyr.com/widget/booking/LNPnkvxkpEcnG3noYld1', 'https://links.vectyr.com/js/form_embed.js'),
  ('contact', 'Contact', 'https://links.vectyr.com/widget/form/0hTygOR1iqFhayLJoVHm', 'https://links.vectyr.com/js/form_embed.js');
