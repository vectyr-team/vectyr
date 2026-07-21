
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT;
