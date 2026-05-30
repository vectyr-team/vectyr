CREATE TABLE public.site_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_widget_code text NOT NULL DEFAULT '<script src="https://beta.leadconnectorhq.com/loader.js" data-resources-url="https://beta.leadconnectorhq.com/chat-widget/loader.js" data-widget-id="6a1af79b7645b2ba9a061382"></script>',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_widgets TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_widgets TO authenticated;
GRANT ALL ON public.site_widgets TO service_role;

ALTER TABLE public.site_widgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site widgets"
  ON public.site_widgets FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site widgets"
  ON public.site_widgets FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site widgets"
  ON public.site_widgets FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_site_widgets_updated_at
  BEFORE UPDATE ON public.site_widgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_widgets (chat_widget_code) VALUES (DEFAULT);
