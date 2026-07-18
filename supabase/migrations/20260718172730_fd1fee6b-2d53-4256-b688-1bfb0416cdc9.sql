
-- 1. Allow users to read their own role rows
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Restrict page_settings SELECT to admins only (public site does not read it)
DROP POLICY IF EXISTS "Public can view page settings" ON public.page_settings;
DROP POLICY IF EXISTS "Anyone can view page settings" ON public.page_settings;
DROP POLICY IF EXISTS "Page settings are viewable by everyone" ON public.page_settings;

CREATE POLICY "Admins can view page settings"
  ON public.page_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

REVOKE SELECT ON public.page_settings FROM anon;

-- 3. Lock down SECURITY DEFINER functions from direct API execution.
--    has_role is invoked from RLS policies at the database level and does
--    not require EXECUTE for the calling role there.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
