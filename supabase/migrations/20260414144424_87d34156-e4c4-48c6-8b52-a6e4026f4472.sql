
-- Departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read departments" ON public.departments FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert departments" ON public.departments FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update departments" ON public.departments FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete departments" ON public.departments FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Team members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  photo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read team members" ON public.team_members FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert team members" ON public.team_members FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update team members" ON public.team_members FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete team members" ON public.team_members FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_team_members_slug ON public.team_members(slug);
CREATE INDEX idx_team_members_department ON public.team_members(department_id);

-- Team grid settings (single row)
CREATE TABLE public.team_grid_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  desktop_columns INTEGER NOT NULL DEFAULT 4,
  tablet_columns INTEGER NOT NULL DEFAULT 3,
  mobile_columns INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_grid_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read grid settings" ON public.team_grid_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert grid settings" ON public.team_grid_settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update grid settings" ON public.team_grid_settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_team_grid_settings_updated_at BEFORE UPDATE ON public.team_grid_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default grid settings
INSERT INTO public.team_grid_settings (desktop_columns, tablet_columns, mobile_columns) VALUES (4, 3, 2);

-- Storage bucket for team photos
INSERT INTO storage.buckets (id, name, public) VALUES ('team-photos', 'team-photos', true);

CREATE POLICY "Anyone can view team photos" ON storage.objects FOR SELECT USING (bucket_id = 'team-photos');
CREATE POLICY "Admins can upload team photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update team photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete team photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'::app_role));
