---
title: Styling Rules
type: convention
tags: [tailwind, primevue, volt, responsive, mobile-first]
---

# Styling Rules

## Tailwind CSS v4

- No `tailwind.config.js` — configured via `@tailwindcss/vite` plugin
- Use PrimeVue design tokens as Tailwind classes: `text-primary`, `bg-surface-0`, `border-surface-200`
- Dark mode via `dark:` variant

## Responsive Design (Mobile-First)

**All UI must be responsive and usable on mobile screens.** Apply Tailwind breakpoints mobile-first:

| Breakpoint | Min-width | Usage |
|---|---|---|
| _(none)_ | 0px | Mobile default |
| `sm:` | 640px | Large phone / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |

**Layout rules:**

- Grids: always start `grid-cols-1` on mobile, expand with `md:grid-cols-2`, `lg:grid-cols-3` etc.
  - ✅ `class="grid grid-cols-1 md:grid-cols-2 gap-4"`
  - ❌ `class="grid grid-cols-2 gap-4"` (breaks on mobile)
- Flex rows that may overflow: use `flex-wrap` or switch to `flex-col` on mobile
  - ✅ `class="flex flex-col sm:flex-row gap-3"`
- Buttons in action bars: use `flex-wrap` so they stack on small screens
  - ✅ `class="flex gap-3 flex-wrap"`
- Page padding/spacing: prefer `p-4 md:p-6` over fixed large values
- Tables (`DataTable`): on mobile, consider hiding less-critical columns with `hidden md:table-cell`
- Modals (`Dialog`): set `:style="{ width: 'min(95vw, 480px)' }"` or equivalent so they never overflow the viewport
- Text: avoid fixed widths on label spans (e.g. `w-24 shrink-0`) that may cause overflow on very small screens — test at 375px
- Images/icons: use relative sizes (`size-5`, `w-full`) over fixed pixel values

**Touch targets:**

- Interactive elements (buttons, inputs) must be at least 44px tall — use `h-9` (36px) minimum; prefer `h-10` or `py-2.5` for touch-friendly tap areas
- Avoid placing two tappable elements closer than 8px

**Overflow prevention:**

- Wrap long content with `truncate`, `break-words`, or `overflow-hidden` where appropriate
- Horizontal scroll is acceptable only inside `DataTable` — never at the page level

## PrimeVue Styling (Volt Pattern)

- PrimeVue configured with `unstyled: true`
- All component styling lives in `src/volt/` as PT (PassThrough) objects with Tailwind classes
- **Never add `scoped` CSS** in components that use volt wrappers
- `ptViewMerge` utility in `src/volt/utils.ts` merges PT props — use it in all volt components

## CSS Files

- `src/assets/css/tailwind.css` — Tailwind base import
- `src/assets/css/primevue.css` — PrimeVue custom tokens/overrides
- `src/assets/css/main.css` — Global app styles
- `src/assets/css/fonts.css` — Font-face declarations
