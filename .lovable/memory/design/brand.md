---
name: Vectyr brand palette and typography
description: Full color palette, font stack, typography rules, and named color aliases
type: design
---

## Colors (HSL in CSS vars)

- Background: #090909 → --background
- Card/surface: #151616 → --card
- Border: #2E2E2E → --border
- Muted text: #9F9F9F → --muted-foreground
- Foreground: #F5F5F5 → --foreground
- Accent/Primary: #FF5000 → --primary

## Named Color Aliases (Tailwind)

- `orange` → #FF5000
- `black01` → #090909
- `black02` → #151616
- `black03` → #2E2E2E
- `black04` → #777777
- `gray` → #9F9F9F
- `lightgray` → #F5F5F5

Usage: `bg-orange`, `text-lightgray`, `border-black03`, etc.

## Fonts

- Headlines: Bebas Neue (`font-headline`)
- Body: Inter (`font-body`)
- Overlines/Accent: JetBrains Mono (`font-mono`)

## Typography Rules

- **Headings must always use `font-normal` weight.** Never apply bold, semibold, or any other weight to headings.
