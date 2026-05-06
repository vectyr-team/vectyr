
CREATE TABLE public.home_hero (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  headline_lead text NOT NULL DEFAULT 'Your Brand is Living in Your Head.',
  headline_accent text NOT NULL DEFAULT 'Nowhere Else.',
  subtitle text NOT NULL DEFAULT 'We turn the messy, implicit brand knowledge in a founder''s mind into a clean, accessible, AI-ready system that the whole organization can use without constant founder input.',
  primary_button_label text NOT NULL DEFAULT 'Book a Demo',
  primary_button_link text NOT NULL DEFAULT '/demo',
  secondary_button_label text NOT NULL DEFAULT 'FAQs',
  secondary_button_link text NOT NULL DEFAULT '/faqs',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.home_hero ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read home hero" ON public.home_hero FOR SELECT USING (true);
CREATE POLICY "Admins can insert home hero" ON public.home_hero FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update home hero" ON public.home_hero FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER home_hero_updated_at BEFORE UPDATE ON public.home_hero FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.home_hero DEFAULT VALUES;
