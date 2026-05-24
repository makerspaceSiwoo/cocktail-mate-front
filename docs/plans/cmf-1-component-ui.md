# CMF-1 · Component UI Foundation

## Goal
Build the atomic UI primitives for CocktailMate front-end on `feat/cmf-1-component-ui`, using **Radix UI** + **Tailwind CSS v4**, with **Storybook 10** stories for each. Pages are out of scope.

## Source of Truth
- Design tokens & icon set: `../cocktail-mate-figma-export/` (light/dark themes + 29 icons)
- Project rules: `CLAUDE.md` (FSD layout, naming, styling, a11y)
- Branch pattern (husky `validate-branch-name`): `^(main|develop|(feat|fix|hotfix|chore|docs|refactor|test)\/[a-z0-9._-]+)$` — branch is **lowercase** `feat/cmf-1-component-ui`.

## Hard Constraints
- All public components live in `src/shared/ui/<kebab-name>/`
- File names: kebab-case (`button.tsx`), component names: PascalCase (`Button`), **named export** only
- Stories alongside component as `*.stories.tsx`
- Tailwind utility classes only; design tokens via CSS variables in `globals.css`
- No hardcoded color hex in components — must resolve through tokens
- Server Component by default; add `"use client"` only when interactivity demands it
- Type-check, lint, and `next build` must pass (pre-commit hook enforces)

## Approved New Dependencies
The user explicitly requested Radix + Tailwind. Add only:
- `@radix-ui/react-slot` — `asChild` polymorphism
- `@radix-ui/react-tabs` — accessible Tabs primitive
- `clsx` + `tailwind-merge` — `cn()` helper
- `class-variance-authority` — variant typing

No other packages without further approval.

## Design Tokens (from Figma export)

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#f3efe7` | `#15120e` |
| `--color-card-bg` | `#ffffff` | `#1f1b16` |
| `--color-profile-bg` | `#f6e6dd` | `#2a221a` |
| `--color-banner-bg` | `#f0e3d3` | `#2a221a` |
| `--color-text` | `#1d1814` | `#f3efe7` |
| `--color-muted` | `#86796b` | `#8d7f6e` |
| `--color-accent` | `#b88a5c` | `#d4a26a` |
| `--color-heart` | `#e85a6b` | `#ff6b7d` |
| `--color-chip-bg` | `#efe6d9` | `#2c241c` |
| `--color-border` | `#e3dcd0` | `#332a22` |
| `--color-border-soft` | `#ece5d9` | `#26201a` |
| `--color-search-bg` | `#ffffff` | `#1f1b16` |

Fonts (existing or via @next/font in a later task — not in scope here):
- Sans: `Pretendard, system-ui, sans-serif`
- Serif: `Cormorant Garamond, Pretendard, serif`

Dark mode toggled via `.dark` class on `<html>` (Tailwind v4 `@variant dark (.dark &)`).

---

## Tasks

### T1 — Foundation
**Files:** `package.json`, `src/app/globals.css`, `src/shared/lib/cn.ts`
**Steps:**
1. `pnpm add @radix-ui/react-slot @radix-ui/react-tabs clsx tailwind-merge class-variance-authority`
2. Extend `globals.css`: add `@theme inline { … }` block exposing every token above as a Tailwind utility (`bg-bg`, `text-text`, `border-border-soft`, etc.), with CSS variables in `:root` (light) and `.dark` (dark) selectors.
3. Add `@variant dark (.dark &);` so dark mode works class-based.
4. Create `src/shared/lib/cn.ts` exporting `cn(...inputs)` = `twMerge(clsx(inputs))`.
5. Storybook preview: add a `globalTypes.theme` toggle (light/dark) and a decorator that toggles `.dark` on the root; this lets every story preview both themes.

**Acceptance:**
- `pnpm typecheck && pnpm lint && pnpm build` pass
- Tailwind utilities `bg-bg`, `text-text`, `bg-card-bg`, `text-muted`, `text-accent`, `border-border`, `border-border-soft`, `bg-chip-bg`, `text-heart` all resolve
- `pnpm storybook` boots; theme switcher visible in toolbar
- `cn("a", { b: true }, ["c"])` returns `"a b c"`

### T2 — Icon
**Files:** `src/shared/ui/icon/icon.tsx`, `src/shared/ui/icon/icons.tsx`, `src/shared/ui/icon/icon.stories.tsx`, `src/shared/ui/icon/index.ts`
**Steps:**
1. Port the 29 icons from `cocktail-mate-figma-export/icons/*.svg` into React function components in `icons.tsx`. Each accepts `{ size?: number; className?: string }`, uses `currentColor`, and matches the source SVG (`width`, `viewBox`, paths). Default `size` = source size.
2. Create a typed `IconName` union and an `<Icon name="Heart" size={20} className="text-heart" />` dispatch component in `icon.tsx`.
3. Named exports: `Icon`, `IconName`, and each individual icon (e.g. `HeartIcon`, `BellIcon`) for tree-shaking.
4. Story: a gallery grid showing every icon with name + size 24, color via `text-text`. Add controls for `size` and `name`.

**Acceptance:**
- All 29 icon names exposed, type-safe
- Each SVG uses `currentColor` and is sized via the `size` prop (sets both width and height)
- Story renders all icons in light **and** dark theme

### T3 — Button + IconButton
**Files:** `src/shared/ui/button/button.tsx`, `src/shared/ui/button/button.stories.tsx`, `src/shared/ui/button/index.ts`
**Steps:**
1. `Button` uses `cva` variants:
   - `variant`: `primary` (bg-accent text-white), `secondary` (bg-card-bg text-text border border-border), `ghost` (bg-transparent text-text hover:bg-chip-bg)
   - `size`: `sm` (h-9 px-3 text-sm), `md` (h-11 px-4 text-base), `lg` (h-12 px-5 text-base)
   - `fullWidth`: boolean → `w-full`
2. Polymorphism: `asChild?: boolean` using `@radix-ui/react-slot`.
3. Disabled state: `disabled:opacity-50 disabled:cursor-not-allowed`. Focus ring uses `focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-bg`.
4. `IconButton` = `Button` preset for square icon-only usage (`aria-label` required prop, `size` maps to fixed square dimensions, no padding override needed).
5. Stories: matrix of variants × sizes, disabled state, `asChild` example wrapping `<a>`, IconButton story with Heart icon.

**Acceptance:**
- Type: `ComponentProps<"button">` extended, `ref` forwarded
- Story shows all variant×size combinations rendering correctly in light and dark
- IconButton with missing `aria-label` raises a TS error

### T4 — Input
**Files:** `src/shared/ui/input/input.tsx`, `src/shared/ui/input/input.stories.tsx`, `src/shared/ui/input/index.ts`
**Steps:**
1. `Input` wraps native `<input>`: rounded-xl, bg-search-bg, border border-border, text-text, placeholder text-muted, h-11 px-4, focus-visible ring-accent.
2. Slots for `leftIcon` and `rightIcon` (ReactNode); when set, padding adjusts and icon container is absolutely positioned inside.
3. `error?: boolean` toggles `border-heart` and `ring-heart` on focus.
4. `ref` forwarded.
5. Stories: default, with search icon left, with clear icon right, error state, disabled.

**Acceptance:**
- Native `<input>` props pass through (`name`, `value`, `onChange`, `placeholder`, `type`, `disabled`, `aria-*`)
- Visual story matches Figma search field (rounded full bg-white in light, bg-card-bg in dark) — use `rounded-full` for search-style inputs as a variant or default

### T5 — Card + Badge
**Files:** `src/shared/ui/card/card.tsx`, `src/shared/ui/card/card.stories.tsx`, `src/shared/ui/card/index.ts`, `src/shared/ui/badge/badge.tsx`, `src/shared/ui/badge/badge.stories.tsx`, `src/shared/ui/badge/index.ts`
**Steps:**
1. `Card`: `div` with `bg-card-bg border border-border rounded-2xl`. Subcomponents `Card.Header`, `Card.Body`, `Card.Footer` via compound exports (named exports, not dot-syntax — `CardHeader`, `CardBody`, `CardFooter`).
2. `Badge`: `span` with `bg-chip-bg text-text text-xs px-2 py-0.5 rounded-full`. Variants: `default`, `accent` (bg-accent text-white), `outline` (border border-border bg-transparent).
3. Stories: Card with header/body/footer; Badge variant matrix.

**Acceptance:**
- All exports named (no default exports)
- Both render correctly in light and dark themes

### T6 — Tabs
**Files:** `src/shared/ui/tabs/tabs.tsx`, `src/shared/ui/tabs/tabs.stories.tsx`, `src/shared/ui/tabs/index.ts`
**Steps:**
1. Wrap `@radix-ui/react-tabs` Root/List/Trigger/Content with styled named exports `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
2. TabsList: `flex border-b border-border`. TabsTrigger: `px-4 py-2 text-muted data-[state=active]:text-text data-[state=active]:border-b-2 data-[state=active]:border-accent`. TabsContent: `pt-4`.
3. Forward refs.
4. Story: three-tab example (`홈`, `탐색`, `마이`) with placeholder content per tab.

**Acceptance:**
- Keyboard nav works (Radix default)
- Active tab visually distinct in both themes

### T7 — BottomTabBar (interactive, 4-tab)
**Files:** `src/shared/ui/bottom-tab-bar/bottom-tab-bar.tsx`, `src/shared/ui/bottom-tab-bar/bottom-tab-bar.stories.tsx`, `src/shared/ui/bottom-tab-bar/index.ts`
**Steps:**
1. Component takes `items: Array<{ id: string; label: string; icon: IconName; iconFilled?: IconName; href?: string }>`. Supports both controlled (`activeId`) and uncontrolled (`defaultActiveId`) modes. Optional `onSelect(id)` fires on every selection. Renders a horizontal `<nav>` with each item as a `<Link>` if `href` provided else `<button>`.
2. Layout: `border-t border-border bg-card-bg flex justify-around items-center pt-2.5 pb-1 touch-pan-y select-none`. Each item: vertical stack `gap-1`, icon size 26, label `text-[11px]`, active uses filled icon + `font-bold text-text`, inactive uses outline icon + `font-medium text-muted`. Active tap feedback via `active:opacity-70`.
3. **Interactivity** (all built into the component):
   - Click/tap → switch active tab (uncontrolled state updates internally; controlled mode delegates to parent via `onSelect`).
   - Horizontal swipe on the nav (pointer events — works for mouse, touch, and pen) → swipe-left = next tab, swipe-right = previous tab. Wraps around at the ends. Threshold configurable via `swipeThreshold` (default 40px); disable entirely with `enableSwipe={false}`.
   - Keyboard: `ArrowLeft`/`ArrowRight` move by one, `Home`/`End` jump to first/last. Works whenever any tab item has focus.
4. Single preset export `FOUR_TAB_ITEMS` (home, explore, cocktail, my) — built from icon names in T2. No 5-tab variant (the IA settled on 4 tabs).
5. Stories: `Interactive` (uncontrolled, demonstrates all gestures), `Controlled` (parent-owned `activeId`, select control), `WithLinks` (each item navigates via `next/link`), `SwipeDisabled` (click + keyboard only). All wrapped in `w-[375px]` to match Figma frame.

**Acceptance:**
- `aria-current="page"` on the active item
- Each item is keyboard-focusable; ArrowLeft/ArrowRight/Home/End navigate
- Click and pointer-based swipe both update the active tab when uncontrolled
- Controlled mode never overrides parent state internally
- Story renders a 375px-wide frame to match Figma

---

## Out of Scope (do NOT do)
- Building pages or screens (HomeScreen, LoginScreen, etc.)
- Wiring data fetching
- Theme switcher UI in the app itself (Storybook decorator only)
- Adding fonts (Pretendard, Cormorant Garamond) to the Next.js app
- Touching `src/app/(auth|guest|member)` files

## Verification (after every task)
Run from `cocktail-mate-front/`:
```
pnpm typecheck && pnpm lint && pnpm build
```
Then `pnpm storybook` and visually verify story renders in both themes.

## Final
After T7: dispatch a final code-review subagent over the whole diff and report status.
