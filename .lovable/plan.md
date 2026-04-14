

## Plan: Add "Company" Dropdown to Header Navigation

### What changes
Replace the standalone "Contact" nav link with a "Company" dropdown containing About, Team, FAQs, and Contact. The nav order becomes: **Company** (dropdown) → **Demo** → **Login**.

### Desktop
- "Company" label styled identically to other nav links (mono, uppercase, xs)
- On click, a minimal dropdown appears below with the four links, styled to match the dark brand (bg `#090909`, border `#2E2E2E`, text in muted/foreground)
- Clicking outside or navigating closes it
- Entrance animation uses the same staggered fade-up as other nav items

### Mobile
- In the fullscreen menu, replace "Contact" with the four Company sub-links (About, Team, FAQs, Contact) shown inline — no nested dropdown needed on mobile
- Remove "Company" as a heading; just list the pages directly in the menu

### Technical approach

**File: `src/components/Header.tsx`**

1. Update `navLinks` array — remove Contact, reorder to: `Company` (marker), `Demo`, `Login`
2. Add state `companyOpen` for the dropdown toggle
3. Desktop nav: render "Company" as a `<button>` that toggles the dropdown. Render a positioned `<div>` below it with four `<Link>` items (About `/about`, Team `/team`, FAQs `/faqs`, Contact `/contact`). Close on click-outside via a `useEffect` listener, and on route change.
4. Mobile menu: replace the current `navLinks.map` with a flat list: About, Team, FAQs, Contact, Demo, Login — all as full-screen staggered links
5. Dropdown styling: `absolute top-full right-0`, dark bg matching brand, subtle border, each item with hover highlight. Uses CSS transform for the same entrance animation pattern.
6. Update `navDelayOrder` and `socialDelayOrder` arrays to match the new item count

No new dependencies needed — pure React state + existing brand styles.

