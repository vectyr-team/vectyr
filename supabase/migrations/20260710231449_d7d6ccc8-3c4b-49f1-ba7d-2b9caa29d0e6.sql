ALTER TABLE public.home_hero
  ADD COLUMN IF NOT EXISTS headline_line1 text,
  ADD COLUMN IF NOT EXISTS headline_line2 text;

UPDATE public.home_hero
SET headline_line1 = COALESCE(headline_line1, headline_lead),
    headline_line2 = COALESCE(headline_line2, '<span>' || headline_accent || '</span>')
WHERE headline_line1 IS NULL OR headline_line2 IS NULL;