
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  quote TEXT NOT NULL,
  rating SMALLINT NOT NULL DEFAULT 5,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view testimonials"
  ON public.testimonials FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.testimonials (name, title, quote, rating, sort_order) VALUES
('Matthew Dickerson', NULL, 'Vectyr is incredible! Steve and team are very talented and can help take your company and brand to the next level. Honest, Communicative and Reasonable. Contact them today!', 5, 0),
('Adam Layton', NULL, 'Steve and Vectyr are the best out there! My company would not be 1/2 of what it is today without them! Would recommend to everyone!', 5, 1),
('Nathan Fort', NULL, 'I''ve worked with many branding companies on various projects and businesses. Steve Reed''s attention to detail and his mastery of the nuances of communication are uncommon. I feel like Steve and his team at Vectyr understand the challenges and opportunities our businesses face and have provided valuable recommendations and timely follow-through. Highly recommend!', 5, 2),
('Brent Hancock', NULL, 'Steve and his team are great to work with! He is very creative and truly cares about the growth of your business.', 5, 3),
('David Victor Clark', NULL, 'I''ve worked with many brand strategies over the years. Vectyr, and Steve specifically, are unique as a brand and marketing agency because they question, assess and validate (or invalidate) every assumption a company builder makes about their identity and value proposition. Vectyr lives at the intersection of strategy, story, brand, and design execution, which is exactly where you want your branding agency to be in my opinion. Thanks Steve and team!', 5, 4),
('Tina Hancock', NULL, 'Working with Steve and his team is a game changer. They have elevated our company and helped us stand out. Top quality service and a creativity unmatched.', 5, 5),
('Nathan Shaffer', NULL, 'Vectyr is an amazing company. I have been working with Steve for many years. He has helped me design websites, packaging and logos for a variety of products and businesses I have been a part of. His team is well equipped to handle all of the marketing and branding needs a person could have. I''ll recommend Steve and Vectyr to anyone.', 5, 6),
('Tim Carlsen', NULL, 'The Vectyr Team consistently has delivered on time and on budget all our projects. Everything we have received from them is first rate. We simply could not be more satisfied with the service and will continue to work with this talented group of marketers.', 5, 7),
('Melanie Carminati', NULL, 'Had an outstanding experience with Vectyr. Everyone on the team was thorough, easy to work with and delivered above expectations. Highly recommend for any business owner seeking precise branding buildout & strategy.', 5, 8);
