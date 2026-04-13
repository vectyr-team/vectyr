

## Footer always at bottom

The standard approach is to make the page layout use `min-h-screen` with a flex column, so the main content grows to fill available space and the footer is pushed to the bottom.

### Changes

**src/App.tsx** — Wrap the route layout in a flex column with `min-h-screen`, and make the main content area use `flex-1` (or `flex-grow`) so it expands to fill remaining space, pushing the Footer down.

This is a CSS-only fix using:
```
<div className="flex flex-col min-h-screen">
  <Header />
  <main className="flex-1">
    {/* page routes */}
  </main>
  <Footer />
</div>
```

No other files need changes.

