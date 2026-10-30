CREATE TABLE public.home_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'lucide:sparkles',
  title text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  modal_title text NOT NULL DEFAULT '',
  modal_description text NOT NULL DEFAULT '',
  cta_link text NOT NULL DEFAULT '/contact',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.home_services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.home_services TO authenticated;
GRANT ALL ON public.home_services TO service_role;

ALTER TABLE public.home_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read home services"
  ON public.home_services FOR SELECT USING (true);
CREATE POLICY "Admins can insert home services"
  ON public.home_services FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update home services"
  ON public.home_services FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete home services"
  ON public.home_services FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_home_services_updated_at
  BEFORE UPDATE ON public.home_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.home_services (icon, title, summary, modal_title, modal_description, sort_order) VALUES
('lucide:repeat', 'Ongoing Creative Help', 'A fractional creative department that handles your design, campaigns, and ad management month to month, with no long-term contract.', 'Ongoing Creative Help', 'A fractional creative department that handles your design, campaigns, and ad management month to month, with no long-term contract.', 0),
('lucide:compass', 'Brand Strategy', 'We pull what you know out of your head and into a Brand Intelligence System your whole team, your vendors, and your freelancers can run on.', 'Brand Strategy', 'We pull what you know out of your head and into a Brand Intelligence System your whole team, your vendors, and your freelancers can run on.', 1),
('lucide:users', 'Understand Customers', 'Interviews with your customers become a detailed profile of how they experience the problem you solve, in their own words.', 'Understand Customers', 'Interviews with your customers become a detailed profile of how they experience the problem you solve, in their own words.', 2),
('lucide:pen-tool', 'Logo & Visual Identity', 'A responsive logo and a complete identity system with clear rules, so your brand looks right everywhere it shows up.', 'Logo & Visual Identity', 'A responsive logo and a complete identity system with clear rules, so your brand looks right everywhere it shows up.', 3),
('lucide:monitor', 'Website Design', 'Custom sites built around what your business needs, dialed into your audience with SEO and AEO basics included from day one.', 'Website Design', 'Custom sites built around what your business needs, dialed into your audience with SEO and AEO basics included from day one.', 4),
('lucide:message-circle', 'Brand Consulting', 'Hourly sessions for branding questions, problem-solving, or a stubborn design issue, in blocks of one hour or several.', 'Brand Consulting', 'Hourly sessions for branding questions, problem-solving, or a stubborn design issue, in blocks of one hour or several.', 5);