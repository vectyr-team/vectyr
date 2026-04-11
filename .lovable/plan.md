

## Fix: Mobile viewport height discrepancy in hero

**Problem**
Brave on mobile (Chromium-based) has the same dynamic toolbar behavior as Safari — `vh` units include the area behind the collapsible address bar, making `min-h-[90vh]` taller than expected on real devices vs. simulators.

**Solution**
Replace `min-h-[90vh]` with `min-h-[90dvh]` on the hero section in `src/pages/Index.tsx`. The `dvh` unit accounts for the actual visible viewport. Brave supports `dvh` fully.

**File:** `src/pages/Index.tsx` — 1 class change on the hero `<section>`.

