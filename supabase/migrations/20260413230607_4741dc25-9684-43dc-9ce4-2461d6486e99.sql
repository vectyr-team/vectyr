-- Single-row business info for JSON-LD
CREATE TABLE public.business_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL DEFAULT 'Vectyr',
  legal_name text NOT NULL DEFAULT 'Vectyr, Ltd.',
  description text NOT NULL DEFAULT '',
  telephone text NOT NULL DEFAULT '+15128791233',
  email text NOT NULL DEFAULT 'hello@vectyr.com',
  street_address text NOT NULL DEFAULT '701 Tillery St, Unit 12-1045',
  address_locality text NOT NULL DEFAULT 'Austin',
  address_region text NOT NULL DEFAULT 'TX',
  postal_code text NOT NULL DEFAULT '78702',
  address_country text NOT NULL DEFAULT 'US',
  geo_latitude numeric NOT NULL DEFAULT 30.2672,
  geo_longitude numeric NOT NULL DEFAULT -97.7431,
  service_areas text[] NOT NULL DEFAULT ARRAY['Austin, TX', 'United States'],
  services text[] NOT NULL DEFAULT ARRAY['Brand Strategy', 'Brand Codex Development', 'BrandOS Platform', 'BrandPulse Maintenance', 'Brand Infrastructure for AI'],
  opening_hours text NOT NULL DEFAULT 'Mo-Fr 09:00-17:00',
  founding_date text NOT NULL DEFAULT '2005',
  founder_name text NOT NULL DEFAULT 'Steve Reed',
  founder_url text NOT NULL DEFAULT 'https://stevesbrain.com',
  founder_linkedin text NOT NULL DEFAULT 'https://www.linkedin.com/in/stevereedbrands',
  rating_value numeric NOT NULL DEFAULT 5.0,
  review_count integer NOT NULL DEFAULT 47,
  social_links text[] NOT NULL DEFAULT ARRAY['https://www.youtube.com/@vectyrbrands', 'https://www.behance.net/vectyr', 'https://www.linkedin.com/in/stevereedbrands'],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.business_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read business info" ON public.business_info FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update business info" ON public.business_info FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert business info" ON public.business_info FOR INSERT TO authenticated WITH CHECK (true);

CREATE TRIGGER update_business_info_updated_at
  BEFORE UPDATE ON public.business_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a default row
INSERT INTO public.business_info (description) VALUES ('Vectyr is a brand infrastructure company that extracts, structures, and installs brand strategy for founders — making it usable by humans and AI tools alike.');

-- Per-page meta tags
CREATE TABLE public.page_meta (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read page meta" ON public.page_meta FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update page meta" ON public.page_meta FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert page meta" ON public.page_meta FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete page meta" ON public.page_meta FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_page_meta_updated_at
  BEFORE UPDATE ON public.page_meta
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default meta for all pages
INSERT INTO public.page_meta (page_slug, title, description) VALUES
  ('home', 'Vectyr — Brand Infrastructure for Humans and AI', 'Vectyr extracts your brand, structures it for humans and AI, and installs it everywhere your team works. Stop winging it.'),
  ('about', 'About Vectyr — Twenty Years Building Brands', 'Meet the founder, understand the methodology, and learn why Vectyr builds brand operating systems instead of logos.'),
  ('demo', 'Book a Demo — Experience BrandOS Live', 'Walk through the BrandOS platform, see how your brand gets built and integrated with AI tools, and decide if it''s a fit.'),
  ('contact', 'Contact Vectyr — Let''s Talk Brand Strategy', 'Have questions or ready to start? Reach out to Vectyr for an honest conversation about your brand.'),
  ('faqs', 'FAQs — Everything You Need to Know About Vectyr', 'Get answers to common questions about the Brand Codex, BrandOS platform, pricing, and how Vectyr works.');