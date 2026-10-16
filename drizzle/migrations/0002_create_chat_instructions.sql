CREATE TABLE public.chat_settings (
  id text PRIMARY KEY CHECK (id = 'general'),
  instructions text NOT NULL DEFAULT 'You are Vectyr''s AI assistant. Be direct, concise, helpful and conversational. Do not use em dashes.' CHECK (char_length(instructions) <= 12000),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.chat_settings TO authenticated;
GRANT ALL ON public.chat_settings TO service_role;
ALTER TABLE public.chat_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read chat settings" ON public.chat_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins add chat settings" ON public.chat_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update chat settings" ON public.chat_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER chat_settings_updated_at BEFORE UPDATE ON public.chat_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();