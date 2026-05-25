# CMF-2 · Figma Component Library Pass

Build the components defined in Figma file `pDKK774YFqVw9v0ReQ0Yd5` ("CocktailMate-Component-Library"), node `1:5`. Branch `feat/cmf-1-component-ui` continues (additive — do **not** rewrite existing primitives unless explicitly listed).

## Source of truth
- Figma file: `pDKK774YFqVw9v0ReQ0Yd5`, page `1:5`
- All design tokens already match our `globals.css` (verified): `--color-text` = `#1d1814`, `--color-bg` = `#f3efe7`, `--color-card-bg` = `#ffffff`, `--color-border` = `#e3dcd0`, `--color-border-soft` = `#ece5d9`, `--color-muted` = `#86796b`, `--color-accent` = `#b88a5c`, `--color-heart` = `#e85a6b`, `--color-search-bg` = `#ffffff`, `--color-chip-bg` = `#efe6d9`. Dark variants already wired.
- Figma variable name → our Tailwind utility:
  - `--text` → `text-text` / `bg-text`
  - `--bg` → `bg-bg` / `text-bg`
  - `--cardbg` → `bg-card-bg`
  - `--muted` → `text-muted`
  - `--border` → `border-border`
  - `--bordersoft` → `border-border-soft`
  - `--searchbg` → `bg-search-bg`
  - `--surfacelift` → `bg-card-bg` (no dedicated token; same surface)
  - `--heart` → `text-heart` / `bg-heart`
  - `--accent` → `text-accent` / `bg-accent`

## Already built (do NOT rebuild)
`Button`, `IconButton` (with naked/toggle/pressedIcon), `Input` (search-style), `Card` + subcomponents, `Badge`, `Tabs` (Radix), `BottomTabBar` (4-tab, click/swipe/keyboard), `Icon` library (29 icons).

## Scope
17 new components + 1 new icon + 1 Button variant + 1 BottomTabBar visual tweak.

## Conventions (recap from CLAUDE.md)
- Path: `src/shared/ui/<kebab-name>/`
- Files: `<kebab>.tsx`, `<kebab>.stories.tsx`, `index.ts`
- Component names: PascalCase, **named exports** only
- Use `cn()` from `@/shared/lib`
- Use design-token utility classes; no hex literals
- Server Component by default; `"use client"` only when interactivity demands
- CSF3 stories, `Meta`/`StoryObj` typed, light + dark via existing theme toolbar
- Wrap mobile-frame stories in `<div className="w-[375px] mx-auto">` (this matches the Figma frame width)

---

## Components

### 1. Icon/Eye (add to icon library)
**Figma node:** `71:1319`
**Action:** Add `EyeIcon` and `EyeOffIcon` to `src/shared/ui/icon/icons.tsx` + register in `IconName` union + REGISTRY in `icon.tsx` + barrel export.
**Specs:**
- ViewBox `0 0 24 24`, size default 24, stroke `currentColor` width 1.6
- `EyeIcon`: `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>`
- `EyeOffIcon`: `<path d="M3 3l18 18"/><path d="M10.6 5.1A11 11 0 0112 5c7 0 10 7 10 7a17.6 17.6 0 01-3.2 4"/><path d="M6.3 6.3A17 17 0 002 12s3 7 10 7a11 11 0 005-1.2"/><circle cx="12" cy="12" r="3"/>`

### 2. Button — add `cta` variant
**Figma node:** `71:1331` (`CTAButton`)
**Action:** Extend `buttonVariants` in `src/shared/ui/button/button.tsx`:
```ts
cta: "bg-text text-bg hover:opacity-90 active:opacity-80 font-bold tracking-[-0.01em]"
```
Add CTA story to `button.stories.tsx`:
- `CTA` — `<Button variant="cta" size="lg" fullWidth>로그인</Button>` (h-12 ~ approximates Figma's h-52)
- `CTADisabled` — same but `disabled`.

Figma exact spec: bg `--text` (`#1d1814`), text `--bg` (`#f3efe7`), font-weight 700, text 15px (`text-[15px]` or `text-base`), tracking `-0.15px`, height 52, rounded `14`. Acceptable to approximate via existing sizes; the visual match should be close to `h-12 rounded-xl`.

### 3. StatusBar
**Files:** `src/shared/ui/status-bar/status-bar.tsx`, `.stories.tsx`, `index.ts`
**Figma node:** `27:80`
**Spec:**
- Container: `flex items-center justify-between h-[38px] w-[375px] px-[22px] pt-[14px] pb-[4px] bg-bg`
- Left: time string (default `"9:41"`), `font-semibold text-sm text-text`
- Right: indicators row (signal/wifi/battery) — render as simple inline SVGs (no need to match exact iOS icons; small bars + wifi arc + battery rect are fine). Width ~58px, height 12px, color `text-text`
- Props: `time?: string`, `className?: string`
- Stories: `Default`, `CustomTime`

### 4. HomeIndicator
**Files:** `src/shared/ui/home-indicator/home-indicator.tsx`, story, index
**Figma node:** `27:95`
**Spec:**
- Container: `flex items-center justify-center h-[22px] w-[375px] pt-[8px] pb-[10px] bg-bg`
- Inner bar: `h-1 w-[134px] rounded-full bg-text`
- Props: just `className?`
- Story: `Default`

(NOTE: Figma had this bar with bg `white` rather than `var(--bg)`. Per the description text "배경 흰색 고정" it's intentionally always-white. We approximate by using `bg-card-bg` which is white in light, `#1f1b16` in dark — accept this difference since pure-white in dark mode would clash.)

### 5. OrDivider
**Files:** `src/shared/ui/or-divider/or-divider.tsx`, story, index
**Figma node:** `71:1366`
**Spec:**
- Container: `flex items-center gap-3 h-[14px] w-full`
- Two lines: `flex-1 h-px bg-border`
- Center text: `OR` `text-[11px] text-muted tracking-[0.88px] font-normal`
- Optional `label` prop (default `"OR"`)
- Stories: `Default`, `CustomLabel`

### 6. StepIndicator
**Files:** `src/shared/ui/step-indicator/step-indicator.tsx`, story, index
**Figma node:** `71:1374`
**Spec:**
- Container: `flex gap-1.5 h-[3px] w-full`
- Renders `total` bars; each `flex-1 h-[3px] rounded-full`; active gets `bg-accent`, inactive `bg-border`
- Props: `current: number` (1-based), `total: number` (default 3), `className?`
- Stories: `OneOfThree`, `TwoOfThree`, `ThreeOfThree`, `Custom` (total=5)

### 7. CocktailDisc
**Files:** `src/shared/ui/cocktail-disc/cocktail-disc.tsx`, story, index
**Figma node:** `7:28` (Size=64), `7:31` (Size=88)
**Spec:**
- Container: `flex flex-col items-center justify-center gap-2 p-1`
- Disc: `rounded-full size-[64px]` (default) or `size-[88px]` (size="lg"); background color from `color` prop (a CSS hex — caller supplies, e.g. `#e2eed8`). Disc has no border.
- Label: `font-medium text-[11px] text-text whitespace-nowrap` directly below
- Props: `name: string`, `color: string` (CSS color value, REQUIRED), `size?: "sm" | "lg"` (default `"sm"` = 64px)
- Stories: `Default`, `Large`, `Grid` (render 4 discs with the figma palette: `#e2eed8` 클래식 모히토, `#fde0c8` 마가리타, `#f0d4dc` 코스모폴리탄, `#e4d4f0` 보드카 마티니)

### 8. CategoryChip
**Files:** `src/shared/ui/category-chip/category-chip.tsx`, story, index
**Figma nodes:** `6:11` (Active), `6:13` (Inactive)
**Spec:**
- Container: `inline-flex items-center px-4 py-2 rounded-full font-bold text-[13px]` + state classes:
  - Active: `bg-text text-bg`
  - Inactive: `bg-card-bg text-text border border-border`
- Implemented as a `<button type="button">` since it's a filter toggle
- Props: extends `ButtonHTMLAttributes`; `active?: boolean` (default false), `children: ReactNode`
- Stories: `Active`, `Inactive`, `Group` (renders a horizontal flex of 5 chips: 전체 active, 진/럼/위스키/보드카 inactive)

### 9. RecentSearchChip
**Files:** `src/shared/ui/recent-search-chip/recent-search-chip.tsx`, story, index
**Figma node:** `6:23`
**Spec:**
- Container: `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg border border-border text-[12px] text-text`
- Renders the label + a small `CloseIcon size={11}` (the smallest acceptable), wrapped in a clickable `<button>` if `onRemove` is supplied
- Whole component is a `<div>` that contains label + an icon-only `<button aria-label="검색어 삭제">` for the X
- Props: `label: string`, `onRemove?: () => void`, `className?`
- Stories: `Default`, `WithOnRemove` (uses Storybook action), `Group` (3 chips in a flex-wrap row)

### 10. ActionButton
**Files:** `src/shared/ui/action-button/action-button.tsx`, story, index
**Figma node:** `6:121` (Like), `6:126` (Share)
**Spec:**
- Container: `flex items-center justify-center gap-2 h-[50px] w-[160px] px-4 rounded-2xl bg-card-bg border border-border-soft`
- For `tone="like"`: text + count colored `text-heart`; uses `HeartFilledIcon size={22}`
- For `tone="share"`: text colored `text-text`, uses `ShareIcon size={22}`
- Layout: `[Icon] [Label (bold 14px)] [Count (semibold 13px)]`
- Props: `tone: "like" | "share"`, `label: string`, `count?: string | number`, plus button HTML attrs, `aria-label` required
- Stories: `Like` (label "좋아요", count "2.3k"), `Share` (label "공유"), `LikeNoCount`, `Row` (Like + Share side-by-side)

### 11. SectionHeader
**Files:** `src/shared/ui/section-header/section-header.tsx`, story, index
**Figma node:** `6:38` (WithAction), `6:36` (None)
**Spec:**
- Container: `flex items-center justify-between h-9 px-5.5 py-1.5 bg-bg w-full`
  - For px: figma is `px-[22px]` ≈ `px-5.5` (use exact `px-[22px]` arbitrary)
- Title: `font-bold text-[16px] text-text tracking-[-0.32px]`
- Optional action (right side): `text-[12px] text-muted` + `ChevronRightIcon size={12}` icon-right gap `gap-[2px]`
- Props: `title: string`, `actionLabel?: string`, `onAction?: () => void`, `className?`
- If `actionLabel` set, render right-aligned `<button>` containing label + chevron
- Stories: `None`, `WithAction`

### 12. PageHeader
**Files:** `src/shared/ui/page-header/page-header.tsx`, story, index
**Figma node:** `6:54` (Icons=2), `6:63` (Icons=1)
**Spec:**
- Container: `flex items-center justify-between h-[60px] w-[360px] px-[22px] pt-[14px] pb-[16px] bg-bg`
- Left: title `"CocktailMate"` in `font-serif font-bold text-[26px] text-text tracking-[-0.52px]` (use `font-serif` if Tailwind has it via `font-family` — otherwise inline `style={{ fontFamily: 'Cormorant Garamond, serif' }}`)
- Right: icon group `flex gap-4`, each icon a 24px `IconButton variant="naked"` with the supplied icon
- Props: `title?: string` (default `"CocktailMate"`), `actions?: Array<{ icon: IconName; "aria-label": string; onClick?: () => void }>` (1-2 items)
- Stories: `Icons2` (Bell + Search), `Icon1` (Bell only), `NoActions`

### 13. CTAButton (alias of Button variant=cta, no separate file)
Already covered in §2. Just ensure Button stories include CTA examples.

### 14. TextInput
**Files:** `src/shared/ui/text-input/text-input.tsx`, story, index
**Figma nodes:** `71:1320` (Empty), `71:1322` (Filled), `71:1324` (Password)
**Spec:**
- Distinct from existing `Input` (which is search-shaped). This one is the **form-style** input.
- Container is the input itself or wrapping div if password-toggle needed.
- Base class: `flex w-full h-12 px-4 py-3.5 rounded-xl bg-card-bg border border-border text-[14px] text-text placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 transition-colors`
- Password variant: container `flex h-12 ... gap-2 pr-2`, input flex-1 borderless inside (`bg-transparent border-0 focus-visible:ring-0 px-0 py-0 h-full text-[14px] text-text`), trailing button with `EyeIcon`/`EyeOffIcon size={18}` toggling `type="password"|"text"`
- Props: `type?: "text" | "email" | "password"` (default `"text"`), plus all `<input>` props, `error?: boolean`
- When `type="password"`, render the eye-toggle button automatically; clicking it toggles between show/hide
- Stories: `Empty`, `Filled` (defaultValue), `Email`, `Password` (eye toggle works), `Error`, `Disabled`
- Mark `"use client"` (eye toggle needs state)
- Wrap stories in `<div className="w-80">`

### 15. Checkbox
**Files:** `src/shared/ui/checkbox/checkbox.tsx`, story, index
**Figma nodes:** `71:1355` (Square Checked), `71:1359` (Square Unchecked), `71:1360` (Round Checked), `71:1364` (Round Unchecked)
**Spec:**
- Use `@radix-ui/react-checkbox` — **install it**: `pnpm add @radix-ui/react-checkbox`. (One new dep, in the spirit of "use Radix" approval.)
- Wrapper around `Checkbox.Root` / `Checkbox.Indicator`
- Size: `size-[18px]`, border `1.5px border-text`, rounded:
  - Square shape: `rounded-[5px]`
  - Round shape: `rounded-full`
- Checked state: `bg-text` and the indicator (check svg) is white. Use a custom check SVG inside:
  - Path `M3 6l2 2 4-5` strokeWidth 1.6 `stroke-bg` (or `stroke-current text-bg`). Place inside an 11px box.
- Unchecked state: `bg-transparent`
- Props: extends Radix Checkbox props; `shape?: "square" | "round"` (default `"square"`), `size?: number` (default 18)
- Stories: `SquareUnchecked`, `SquareChecked`, `RoundUnchecked`, `RoundChecked`, `WithLabel` (composed with a label like Storybook: `<label className="flex items-center gap-2 text-sm text-text"><Checkbox/> 자동 로그인</label>`), `Disabled`

### 16. SocialButton
**Files:** `src/shared/ui/social-button/social-button.tsx`, story, index
**Figma nodes:** `71:1336` (Kakao), `71:1341` (Apple), `71:1346` (Google)
**Spec:**
- Container: `flex items-center justify-center gap-2.5 h-12 w-full px-4 py-3.5 rounded-2xl border font-semibold text-[14px]`
- Three brand variants — brand colors are FIXED hex values (NOT theme tokens):
  - `kakao`: `bg-[#fee500] border-[#fee500] text-[#1d1814]`. Label `"카카오로 계속하기"`. Inline SVG of Kakao symbol (simplified): a black speech bubble — `<svg viewBox="0 0 18 18"><path d="M9 1.5C4.6 1.5 1 4.2 1 7.5c0 2.1 1.5 4 3.8 5.1l-.7 2.6c-.1.3.3.5.6.3l3-2c.4 0 .9.1 1.3.1 4.4 0 8-2.7 8-6S13.4 1.5 9 1.5z" fill="currentColor"/></svg>` with `text-[#1d1814]`
  - `apple`: `bg-[#1d1814] border-[#1d1814] text-white`. Label `"Apple로 계속하기"`. Apple logo SVG: `<svg viewBox="0 0 18 18"><path d="M13.6 9.5c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.6.8-3.2.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.7.8-3.5 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.1 1.1-2.2 1.2-2.2 0 0-2.5-.9-2.5-3.8zM11.6 3.3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z" fill="currentColor"/></svg>` with `text-white`
  - `google`: `bg-white border-border text-text`. Label `"Google로 계속하기"`. Google 'G' SVG with brand 4-color (just inline the 4-color paths) — for simplicity render as black silhouette `G` using `<svg viewBox="0 0 18 18"><path d="M9 4.5c1.3 0 2.4.5 3.3 1.4l2.4-2.4C13.2 2 11.2 1 9 1 5.5 1 2.5 3 1.2 6l2.8 2.2C4.6 6 6.6 4.5 9 4.5zM17 9c0-.6-.1-1.2-.2-1.8H9v3.6h4.5c-.2 1-.8 1.8-1.7 2.4l2.7 2.1C16 13.9 17 11.6 17 9zM4 10.8c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8L1.2 5C.4 6.2 0 7.6 0 9s.4 2.8 1.2 4l2.8-2.2zM9 17c2.4 0 4.4-.8 5.9-2.2l-2.7-2.1c-.8.5-1.8.8-3.2.8-2.4 0-4.4-1.5-5.2-3.7L1 11.9C2.3 14.9 5.4 17 9 17z" fill="currentColor"/></svg>` — accept simplified rendering
- Props: `brand: "kakao" | "apple" | "google"`, plus button HTML attrs; `label?: string` (default per brand)
- Mark `"use client"` (button event handlers)
- Stories: `Kakao`, `Apple`, `Google`, `All` (vertical stack with `gap-3`)

### 17. SearchBar
**Files:** `src/shared/ui/search-bar/search-bar.tsx`, story, index
**Figma nodes:** `35:105` (Empty,Button=On,Back=On), `35:114` (Filled,Button=On,Back=On), `35:123` (Empty,Button=On,Back=Off), `35:130` (Empty,Button=Off,Back=Off)
**Spec:**
- Container: `flex items-center gap-3 w-[375px] px-[18px] pt-4 pb-3.5 bg-bg`
- Optional left back button (when `showBack`): `<button aria-label="뒤로"><ChevronLeftIcon size={26} className="text-text" /></button>`
- The input field: `flex-1 flex items-center gap-2 pl-4 pr-1 py-2.5 rounded-full bg-search-bg border border-border`
  - Native `<input>` inside: `flex-1 bg-transparent outline-none text-[13.5px] text-text placeholder:text-muted`
  - Optional right search button (when `showSearchButton`): square 34px rounded-full `bg-text` with `SearchIcon size={16} className="text-bg"` inside
- Props: `value?`, `defaultValue?`, `onChange?`, `placeholder?` (default `"검색어를 입력해주세요"`), `showBack?` (default true), `showSearchButton?` (default true), `onBack?: () => void`, `onSearch?: (value: string) => void`
- Submitting (Enter key or search button) fires `onSearch`
- Mark `"use client"` (controlled/uncontrolled state)
- Stories: `Empty`, `Filled` (value="모히토"), `NoBack` (showBack=false), `NoSearchButton` (showSearchButton=false), `Headless` (both off — just the input)
- Wrap each in `<div className="w-[375px] mx-auto bg-bg">`

### 18. CocktailListItem
**Files:** `src/shared/ui/cocktail-list-item/cocktail-list-item.tsx`, story, index
**Figma nodes:** `26:85`, `26:110`, `26:135`
**Spec:**
- Container: `flex items-center gap-3.5 w-full py-4 bg-bg` (no horizontal padding — caller controls)
- Left: 64px colored disc (`rounded-full size-16` with the `color` prop bg)
- Middle: flex-1 column `flex flex-col gap-1.5 min-w-0 overflow-clip`
  - Name: `font-bold text-[17px] text-text tracking-[-0.34px] truncate`
  - Row (tag + description): `flex items-center gap-2 overflow-clip`
    - Tag chip: small rounded-full pill, bg from tag color prop, text 10.5px font-semibold text-text px-2 py-0.5
    - Divider: `w-px h-2.5 bg-border`
    - Description: `text-[11.5px] text-muted truncate`
  - Meta row: `flex items-center gap-2.5`
    - Difficulty group: `flex items-center gap-1` → `GlassIcon size={12}` + `text-[11px] text-muted`
    - Divider `w-px h-2.5 bg-border`
    - ABV `text-[11px] text-muted`
    - Divider
    - Likes group: `flex items-center gap-1` → `HeartIcon size={12}` + `text-[11px] text-muted` (count)
- Right: 22px `HeartFilledIcon` (if `liked`) or `HeartIcon` (if not) — clickable button styled like `IconButton variant="naked"` with internal toggle (use the existing IconButton with toggle props)
- Props:
  ```ts
  interface CocktailListItemProps {
    name: string;
    discColor: string;          // CSS color
    tag?: { label: string; color: string }; // chip bg
    description: string;
    difficulty: "쉬움" | "중" | "어려움";
    abv: number;                // %
    likes: string | number;     // formatted (e.g. "12.4k")
    liked?: boolean;
    defaultLiked?: boolean;
    onLikedChange?: (liked: boolean) => void;
    className?: string;
  }
  ```
- Mark `"use client"` (heart toggle)
- Stories: `Liked` (마가리타 with tag 데킬라/`#fde0c8`, difficulty 중, abv 18, likes "12.4k"), `Unliked`, `NoAlcohol` (tag 무알콜/`#d4f0d8`, abv 0, liked false), `Group` (3 items in a column with `divide-y divide-border-soft`)

### 19. HeroCard
**Files:** `src/shared/ui/hero-card/hero-card.tsx`, story, index
**Figma node:** `7:147`, `7:158`, `7:169`, `7:180`
**Spec:**
- Container: `relative overflow-hidden rounded-[18px] w-[340px] h-[220px]`
- Background layer: `absolute inset-0` with `linear-gradient` (caller-supplied via `gradient` prop or `style`)
- Dark overlay: `absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black/55` (matches Figma 0% → 55% via_15% → 100% 55%)
- Content overlay: `absolute inset-0 flex flex-col justify-end p-5.5 gap-1.5` containing:
  - Name: `font-serif font-bold text-2xl text-white tracking-[-0.02em]`
  - Description: `text-xs text-white leading-snug`
  - Meta row (flex justify-between): two pills `bg-black/30 px-3 py-1 rounded-full text-[11.5px] font-semibold text-white`
    - Left pill: `도수 {abv}%`
    - Right pill: `{indexCurrent}/{indexTotal}` — render only if `indexLabel === true`
- Props:
  ```ts
  interface HeroCardProps {
    name: string;
    description: string;
    abv: number;
    indexLabel?: boolean;     // default true
    indexCurrent?: number;    // default 1
    indexTotal?: number;      // default 5
    gradient: string;         // CSS linear-gradient
    className?: string;
  }
  ```
- Stories with figma exact gradients:
  - `Cosmopolitan`: gradient `linear-gradient(33deg, #c33756 39%, #752133 110%)`, name `코스모폴리탄`, description `상큼한 라임과 크랜베리의 조화, 세련된 분위기를 완성하는 칵테일`, abv 20
  - `BlueHawaii`: gradient `linear-gradient(33deg, #4aa1d9 39%, #1f5a87 110%)`, name `블루 하와이`, abv 15 (description: `시원한 트로피컬 블루의 청량함을 담은 칵테일`)
  - `Negroni`: gradient `linear-gradient(33deg, #c14040 39%, #6b1f1f 110%)`, name `네그로니`, abv 28 (description: `쌉쌀한 캄파리와 진의 클래식 조합`)
  - `Margarita`: gradient `linear-gradient(33deg, #e9d785 39%, #a08732 110%)`, name `마가리타`, abv 18, `indexLabel={false}`

### 20. BottomSheet
**Files:** `src/shared/ui/bottom-sheet/bottom-sheet.tsx`, story, index
**Figma node:** `42:1263`
**Spec:**
- Use `@radix-ui/react-dialog` — **install it**: `pnpm add @radix-ui/react-dialog`
- Expose `BottomSheet.Root`, `BottomSheet.Trigger`, `BottomSheet.Content`, `BottomSheet.Title`, `BottomSheet.Description` — or just a single `BottomSheet` composition. Pick the cleaner Radix-style API and stick with it.
- Overlay: `fixed inset-0 bg-black/40 data-[state=open]:animate-in fade-in-0 data-[state=closed]:animate-out fade-out-0` (Tailwind v4 won't have these animate utils out of the box, so just use `transition-opacity` + state classes)
- Content: `fixed bottom-0 left-0 right-0 mx-auto w-[375px] rounded-t-3xl border border-border-soft bg-card-bg pt-3.5 px-5.5 pb-4.5 flex flex-col` (Figma uses `border-l border-r border-t` only — apply the same)
- Handle: `flex items-center justify-center pb-3.5 h-[22px] w-full` → `h-1 w-9 rounded-full bg-text`
- Provide a Radix `DialogTitle`/`DialogDescription` (visually hidden if not used) for a11y
- Props: `open`, `onOpenChange` passed through; children = sheet body content
- Stories:
  - `WithCocktailItem` — renders trigger button + sheet with: CocktailDisc 64px coral (`#f0d4dc`), name `코스모폴리탄`, description `상큼한 라임과 크랜베리의 조화`, tag `보드카`/`#e4d4f0`, abv 20, plus a dark CTA `Button variant="cta" size="lg" fullWidth` labelled `레시피 보기`
  - `Empty` — sheet with just a title and CTA
- Mark `"use client"`

### 21. BottomTabBar — visual tweak to match Figma
**Files:** `src/shared/ui/bottom-tab-bar/bottom-tab-bar.tsx`
**Figma node:** `27:97`
**Spec deltas vs current:**
- Background: keep `bg-card-bg` (Figma uses pure `white` but our token approximates and supports dark mode)
- Border-top color: stays `border-border`
- Active label: `text-text` with `tracking-[-0.02em]` and `font-bold` (currently `font-bold` ✓ — just add tracking)
- Active icon: filled icon at size 24 (currently 26 — change to 24 to match)
- Padding: pt-2.5 pb-1 ✓ kept
- Each tab item: `flex flex-col gap-1 items-center justify-center px-2 py-1 flex-1 min-w-0` — change icon size to 24 and label `tracking-[-0.02em]`
- **Do not** break the existing interactivity (click/swipe/keyboard) — just adjust visual classes

### 22. Index aggregator (optional — skip if not present already)
There is no `src/shared/ui/index.ts` barrel today; do not add one.

---

## Build order (one batch each implementer call)

### Batch A — atomic primitives (Agent 2A)
1. Icon/Eye (EyeIcon + EyeOffIcon)
2. Button cta variant
3. StatusBar
4. HomeIndicator
5. OrDivider
6. StepIndicator
7. CocktailDisc
8. CategoryChip
9. RecentSearchChip
10. ActionButton
11. SectionHeader
12. PageHeader

### Batch B — composites + Radix (Agent 2B)
13. TextInput (with eye toggle)
14. Checkbox (Radix)
15. SocialButton (3 brand variants)
16. SearchBar
17. CocktailListItem
18. HeroCard
19. BottomSheet (Radix Dialog)
20. BottomTabBar visual tweak

## Acceptance per batch
- All new files at the right paths
- All listed exports named correctly
- `pnpm typecheck && pnpm lint && pnpm build` pass
- Pre-commit hook passes (it runs the same)
- One Conventional Commit per batch:
  - Batch A: `feat(ui): add atomic figma primitives — eye icon, cta, status/home indicator, dividers, chips, headers (cmf-2 A)`
  - Batch B: `feat(ui): add figma composites — text input, checkbox, social, search bar, list item, hero card, bottom sheet (cmf-2 B)`
- Trailer: `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`

## Out of scope
- Page-level routes
- Theme toggle UI in the app
- Pretendard / Cormorant Garamond webfont loading (use system fallbacks)
- Layout changes outside `src/shared/ui/`

## Verification (Agent 3)
After both batches land, Agent 3:
1. Restart Storybook if needed (`pnpm storybook --no-open --ci --port $PORT`)
2. For each component, navigate to its story in light and dark mode
3. Capture computed styles (bg, border, padding, text-color) via DevTools eval inside the iframe
4. Fetch the Figma node screenshot for comparison
5. Report any visual or token deltas to Agent 2 for follow-up fixes
