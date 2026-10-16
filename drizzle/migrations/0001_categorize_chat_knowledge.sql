CREATE TABLE public.chat_knowledge_items (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 category text NOT NULL,
 content text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_knowledge_items TO authenticated;
GRANT ALL ON public.chat_knowledge_items TO service_role;
ALTER TABLE public.chat_knowledge_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage chat knowledge items" ON public.chat_knowledge_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER chat_knowledge_items_updated_at BEFORE UPDATE ON public.chat_knowledge_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.chat_knowledge_items (category, content) SELECT 'Existing Knowledge', content FROM public.chat_knowledge WHERE id = 'hero' AND btrim(content) <> '';
COMMENT ON TABLE public.chat_knowledge IS 'DEPRECATED: replaced by public.chat_knowledge_items categorized knowledge entries';