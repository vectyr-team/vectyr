CREATE TABLE public.chat_knowledge (
 id text PRIMARY KEY DEFAULT 'hero' CHECK (id = 'hero'),
 content text NOT NULL DEFAULT '',
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.chat_knowledge TO authenticated;
GRANT ALL ON public.chat_knowledge TO service_role;
ALTER TABLE public.chat_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read chat knowledge" ON public.chat_knowledge FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert chat knowledge" ON public.chat_knowledge FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update chat knowledge" ON public.chat_knowledge FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));