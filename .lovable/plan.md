## Plan: Add Named Brand Color Aliases

Add six named color tokens to `tailwind.config.ts` so you can use classes like `bg-orange`, `text-black01`, `border-gray`, etc.

### Changes

**`tailwind.config.ts`** — Add these entries inside `extend.colors`:

```ts
orange: "#FF5000",
black01: "#090909",
black02: "#151616",
black03: "#2E2E2E",
black04: "#777777",
gray: "#9F9F9F",
lightgray: "#F5F5F5",
```

These are direct hex values (not HSL vars) since they're static brand tokens. The existing semantic tokens (`primary`, `background`, `card`, etc.) stay untouched — these are just convenient aliases.

**`mem://design/brand`** — Update memory to document the named color aliases.

### Usage examples after the change

- `bg-orange` → `#FF5000`
- `text-lightgray` → `#F5F5F5`
- `border-black03` → `#2E2E2E`
- `bg-black01` → `#090909`
