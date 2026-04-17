
Mirror the FAQs pattern exactly — it's already proven and the user knows the UX.

## Plan: Glossary page + backend editor

### Database
New table `glossary_terms`:
- `id` uuid pk
- `term` text not null
- `definition` text not null
- `sort_order` int default 0
- `created_at`, `updated_at` timestamps

RLS (mirror `faqs`):
- Public SELECT
- Admin INSERT / UPDATE / DELETE via `has_role(auth.uid(), 'admin')`

### Frontend page `/glossary`
New `src/pages/Glossary.tsx` — same shell as `FAQs.tsx` (Header, hero, Footer, SEO).
- Fetch terms ordered by `sort_order`
- Render in an Accordion (term = trigger, definition = content), or a clean definition list — I'll use Accordion to match FAQs visual language
- Staggered fade-in animation (60ms per item, same as FAQs)
- SEO: `<DefinedTermSet>` JSON-LD schema so each term is structured data

### Backend editor
- Add `/glossary` to `ALL_PAGES` in `src/pages/Backend.tsx` with metaSlug `glossary`
- Sidebar gets a Glossary entry automatically
- New `src/components/backend/GlossaryEditor.tsx` — clone of `FAQsEditor.tsx`:
  - List terms with up/down reorder, edit, delete
  - Add new term (term + definition fields)
  - Inline edit mode
- Wire into `Backend.tsx` `renderContent()` like `isFaqsPage`

### Routing
- Add `<Route path="/glossary" element={<Glossary />} />` in `App.tsx`
- Add `/glossary` to prerender routes in `vite.config.ts` so JSON-LD is baked into static HTML
- Add to sitemap edge function and Header nav

### Page meta
Seed a `page_meta` row for slug `glossary` (title, description) so the meta editor in backend works out of the box.

### Out of scope
- No nav link in main Header unless you want it (say the word and I'll add it)
- No category/grouping of terms — flat sorted list
