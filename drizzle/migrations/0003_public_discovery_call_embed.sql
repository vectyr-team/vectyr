CREATE OR REPLACE FUNCTION public.get_discovery_call_embed()
RETURNS TABLE(form_embed_code text, form_script_url text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.form_embed_code, p.form_script_url
  FROM public.page_settings p
  WHERE p.page_slug = 'call'
  ORDER BY p.updated_at DESC
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.get_discovery_call_embed() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_discovery_call_embed() TO anon, authenticated, service_role;