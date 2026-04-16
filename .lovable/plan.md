

## Plan: Admin-driven JSON-LD across the site

### Components to add (in `src/components/JsonLd.tsx`)

1. **`OrganizationJsonLd`** — sitewide. Reads `business_info` (name, url, logo, `sameAs`, contactPoint email/phone, address). Sourced via `useBusinessInfo()`.
2. **`PersonJsonLd`** — TeamMember pages. Reads `team_members` (name, title, photo_url, bio) + `business_info.name` for `worksFor`.
3. **`ServiceJsonLd`** — BrandOS + SiteOps. Reads `page_meta.title` / `page_meta.description` for `name` / `description`. Accepts a `serviceType` prop (hardcoded per page: `"Brand Strategy"` for BrandOS, `"WordPress Management"` for SiteOps). Provider pulled from `business_info`.
4. **`BreadcrumbListJsonLd`** — code-derived from route + page name. Used on Team, TeamMember, BrandOS, SiteOps.

### Files touched

- `src/components/JsonLd.tsx` — add the four new components.
- `src/App.tsx` — mount `<OrganizationJsonLd />` once inside `BrowserRouter` (uses `useBusinessInfo`).
- `src/pages/TeamMember.tsx` — `PersonJsonLd` + `BreadcrumbListJsonLd`.
- `src/pages/Team.tsx` — `BreadcrumbListJsonLd`.
- `src/pages/BrandOS.tsx` — `ServiceJsonLd serviceType="Brand Strategy"` + `BreadcrumbListJsonLd`.
- `src/pages/SiteOps.tsx` — `ServiceJsonLd serviceType="WordPress Management"` + `BreadcrumbListJsonLd`.

### Notes addressed

- **`sameAs`**: already populated in `business_info.social_links` (YouTube, Behance, LinkedIn). `OrganizationJsonLd` will pass it through. No data change needed unless you want to add more profiles via Business Info admin.
- **`serviceType`**: hardcoded per page as a prop — won't change, no admin field needed. Easy to swap to a `page_meta` column later if desired.
- **FAQPage in head**: currently rendered in `<body>` via React. Google reads JSON-LD from anywhere in the document, so it IS being parsed (verifiable with Rich Results Test). No change required, but if you want it strictly in `<head>`, I can move all JSON-LD injection through `SEOHead`'s `useEffect` as a follow-up.
- **BreadcrumbList**: pure route-derived, no admin coupling.

### Result matrix

| Schema | Source | Admin-editable |
|---|---|---|
| Organization (sitewide) | `business_info` | ✅ |
| LocalBusiness (home, existing) | `business_info` | ✅ |
| FAQPage (FAQs, existing) | `faqs` | ✅ |
| Person (team member) | `team_members` | ✅ |
| Service (BrandOS, SiteOps) | `page_meta` + hardcoded `serviceType` | ✅ (name/desc) |
| BreadcrumbList | route | n/a |

No DB migrations, no new tables, no new admin editors.

