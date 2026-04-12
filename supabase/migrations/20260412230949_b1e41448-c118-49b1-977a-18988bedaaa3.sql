
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read FAQs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert FAQs" ON public.faqs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update FAQs" ON public.faqs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete FAQs" ON public.faqs FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
