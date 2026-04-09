

## Plan: Add Header with Centered Logo

### What we're building
A fixed header bar on the dark background with the Vectyr logo centered horizontally.

### Steps
1. **Copy the uploaded SVG logo** (`user-uploads://primary_dark.svg`) to `src/assets/vectyr-logo.svg`
2. **Update `index.css`** — set brand colors as CSS variables (dark background `#090909`, accent `#FF5000`, etc.)
3. **Add Google Fonts** to `index.html` — Bebas Neue, Inter, JetBrains Mono
4. **Update `tailwind.config.ts`** — add font family utilities
5. **Create `src/components/Header.tsx`** — simple header with the logo centered, dark background (`#090909`), subtle bottom border (`#2E2E2E`), fixed/sticky positioning
6. **Update `Index.tsx`** — add Header component above the hero section, build the hero with the previously approved copy
7. **Clean up `App.css`** — remove placeholder styles
8. **Save brand memory** to `mem://` for future consistency

