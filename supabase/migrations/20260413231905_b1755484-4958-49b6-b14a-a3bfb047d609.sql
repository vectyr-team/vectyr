-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Only admins can view user_roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert roles
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Update existing table policies to require admin role for writes

-- business_info: replace write policies
DROP POLICY IF EXISTS "Authenticated users can insert business info" ON public.business_info;
DROP POLICY IF EXISTS "Authenticated users can update business info" ON public.business_info;

CREATE POLICY "Admins can insert business info"
  ON public.business_info FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update business info"
  ON public.business_info FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- faqs: replace write policies
DROP POLICY IF EXISTS "Authenticated users can insert FAQs" ON public.faqs;
DROP POLICY IF EXISTS "Authenticated users can update FAQs" ON public.faqs;
DROP POLICY IF EXISTS "Authenticated users can delete FAQs" ON public.faqs;

CREATE POLICY "Admins can insert FAQs"
  ON public.faqs FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update FAQs"
  ON public.faqs FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete FAQs"
  ON public.faqs FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- page_meta: replace write policies
DROP POLICY IF EXISTS "Authenticated users can insert page meta" ON public.page_meta;
DROP POLICY IF EXISTS "Authenticated users can update page meta" ON public.page_meta;
DROP POLICY IF EXISTS "Authenticated users can delete page meta" ON public.page_meta;

CREATE POLICY "Admins can insert page meta"
  ON public.page_meta FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update page meta"
  ON public.page_meta FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete page meta"
  ON public.page_meta FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- page_settings: replace write policies
DROP POLICY IF EXISTS "Authenticated users can insert page settings" ON public.page_settings;
DROP POLICY IF EXISTS "Authenticated users can update page settings" ON public.page_settings;

CREATE POLICY "Admins can insert page settings"
  ON public.page_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update page settings"
  ON public.page_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));