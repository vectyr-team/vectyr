

## Recommendation: Option 1 (Vite prerendering) + minimal Option 2 fallback

### Why not the others
- **Option 3 (SSR/Remix)**: Massive rewrite. Touches routing, data fetching, auth, admin, every page. Weeks of work and high regression risk for a problem that's purely "get tags into initial HTML." Overkill.
- **Option 2 alone**: Solves Organization/LocalBusiness only. Leaves FAQPage, Person, Service, Breadcrumb invisible to non-JS crawlers — and FAQPage is the highest-value schema on the site (per your earlier note). Partial fix, doesn't meet the goal.
- **Option 1 (prerender)**: Keeps the SPA intact. Build step crawls each route in a headless browser, captures the fully-rendered HTML (including all React-injected JSON-LD), and writes per-route `index.html` files. Crawlers get complete static HTML with every schema baked in. Admin-driven data still flows: at build time the prerenderer fetches live Supabase data via the existing hooks, so whatever's in `business_info`, `team_members`, `page_meta`, `faqs` at build time gets baked in. Re-deploy after admin edits → fresh schema. (Lovable auto-deploys on publish, so this is a natural fit.)

### Implementation plan

**Tool**: `vite-plugin-prerender` is unmaintained. Use **`vite-plugin-prerender-spa`** or, more reliably, **`@prerenderer/rollup-plugin`** with the Puppeteer renderer — actively maintained, works with Vite 5, used in production.

**Routes to prerender**:
`/`, `/about`, `/team`, `/brand-os`, `/site-ops`, `/faqs`, `/demo`, `/contact`, plus dynamic `/team/:slug` (enumerate slugs from Supabase at build time).

**Steps**:
1. Add `@prerenderer/rollup-plugin` + `@prerenderer/renderer-puppeteer` as devDependencies.
2. Update `vite.config.ts` to register the plugin in `build` mode only (skip in dev). Configure:
   - `staticDir`: `dist`
   - `routes`: static list above
   - `renderer`: Puppeteer with `renderAfterTime: 2000` (let React hydrate + Supabase fetches resolve + JSON-LD inject)
   - `postProcess`: optionally move `<script type="application/ld+json">` from body to head for cleanliness (cosmetic — crawlers don't care).
3. For `/team/:slug`: add a small build-time script (`scripts/get-team-slugs.ts`) that queries Supabase for active team member slugs and feeds them into the routes array.
4. Add a SPA fallback (`_redirects` or hosting config) so unknown routes still serve `index.html` for client-side routing of admin pages (`/backend`, `/backend/login` — these should NOT be prerendered).
5. Ensure `useBusinessInfo`, `usePageMeta`, team queries, and FAQ queries all resolve before the snapshot is taken. The 2s render delay handles this; can bump to 3s if needed.
6. Verify locally: `npm run build` → inspect `dist/index.html`, `dist/faqs/index.html`, `dist/team/[slug]/index.html` for `application/ld+json` blocks.
7. After deploy, run the curl command:
   ```bash
   curl -A "GPTBot/1.0" https://vectyr.com/ | grep -i "application/ld+json"
   curl -A "GPTBot/1.0" https://vectyr.com/faqs | grep -i "application/ld+json"
   ```

### Files touched
- `package.json` — add 2 devDependencies
- `vite.config.ts` — register prerender plugin (build-only)
- `scripts/get-team-slugs.ts` (new) — fetch slugs at build time
- No app code changes. No schema components touched. No admin changes.

### Tradeoffs / caveats
- Build time goes from ~10s to ~30–60s (Puppeteer launches once, renders ~10 routes).
- Admin edits require a re-publish to flush new schema into static HTML. (Same as any static site — acceptable for SEO content.)
- Backend/login routes stay client-only (correct — they shouldn't be indexed).
- If Puppeteer has issues in the Lovable build environment, fallback is `@prerenderer/renderer-jsdom` (lighter, no Chrome — works for static schema since JSON-LD doesn't need a real browser to render).

### Verification (post-deploy)
```bash
curl -A "GPTBot/1.0" https://vectyr.com/ | grep -c "application/ld+json"
# Expect: 2+ (Organization + LocalBusiness)

curl -A "GPTBot/1.0" https://vectyr.com/faqs | grep -c "application/ld+json"
# Expect: 2+ (Organization + FAQPage)

curl -A "GPTBot/1.0" https://vectyr.com/brand-os | grep -c "application/ld+json"
# Expect: 3+ (Organization + Service + Breadcrumb)
```

