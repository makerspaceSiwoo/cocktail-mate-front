# cocktail-mate-front

Cocktail Mate 웹 클라이언트. 자연어로 칵테일을 검색하는 MVP의 프론트엔드 레포.

## 디자인 타겟

**모바일 전용** — 데스크탑 레이아웃은 제공하지 않는다. 기준 viewport는 **iPhone 14 Pro Max (430 × 932)**.

- 모든 페이지·컴포넌트는 430 × 932를 기본으로 디자인·구현한다.
- 레이아웃은 `flex` / `grid` 우선. small-screen 범위 (320 ~ 430px) 안에서 자연스럽게 적응하도록 작성한다.
- 데스크탑 viewport에서는 컨텐츠를 430px 폭으로 가운데 정렬 + 좌우 여백으로 표시한다 (PC 전용 화면 없음).
- 고정 width (`w-[400px]`) 대신 `w-full max-w-[430px]` 패턴을 우선한다.

## 기술 스택

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS 4** + CocktailMate 디자인 토큰 (light/dark 매핑)
- **Pretendard** 본문 / **Cormorant Garamond** 타이틀
- **Radix UI** primitives (Avatar / Checkbox / Dialog / Slider / Slot / Tabs) — 저레벨 동작·접근성 위임
- **Embla Carousel** (+ autoplay) · **react-dialog-async** — Carousel / Dialog 도구
- **Storybook 10** (nextjs-vite) — 디자인 시스템 카탈로그
- **pnpm** · **Husky** + **commitlint** + **validate-branch-name**

## 폴더 구조 (가벼운 FSD)

```
src/
├── app/                       # Next.js 라우팅
│   ├── (guest)/               # 비로그인 OK 페이지 (랜딩 등)
│   ├── (member)/              # 로그인 필수 영역 (마이페이지/즐겨찾기)
│   ├── (auth)/                # 로그인 / 회원가입
│   ├── layout.tsx             # 루트 레이아웃 + 폰트 로드
│   └── globals.css            # 디자인 토큰 + Pretendard CDN
├── entities/
│   └── cocktail/              # Cocktail 타입 + 픽스처 데이터
├── features/                  # 도메인 슬라이스 (추후 추가)
├── shared/
│   ├── ui/                    # 공용 컴포넌트 (디자인 시스템 + shadcn 프리미티브)
│   ├── lib/                   # cn 헬퍼
│   ├── api/                   # BE 호출 fetch 래퍼
│   ├── config/                # public env
│   ├── hooks/
│   └── types/
└── middleware.ts              # (member) 인증 가드 스텁
```

`(guest)` / `(member)` / `(auth)` 라우트 그룹은 [middleware.ts](src/middleware.ts)에서 인증 게이트로 분리된다. URL에는 그룹명이 노출되지 않는다.

## 디자인 시스템

CocktailMate 디자인 컴포넌트는 [`src/shared/ui/`](src/shared/ui/)에 있다. 디자인 토큰(색상, 라운드, 폰트)은 [`src/app/globals.css`](src/app/globals.css)의 CSS variables로 정의되어 있다 (light/dark 양쪽).

`shared/ui`는 14개의 atomic primitive만 둔다. 도메인 합성 컴포넌트(CocktailListItem, HeroCard 등)는 `features/` 또는 `entities/`에서 이 primitive들을 조립해 만든다.

| 컴포넌트                           | 베이스                            | 폴더                                             |
| ---------------------------------- | --------------------------------- | ------------------------------------------------ |
| `Avatar`                           | Radix Avatar                      | [avatar/](src/shared/ui/avatar/)                 |
| `Badge`                            | —                                 | [badge/](src/shared/ui/badge/)                   |
| `Button` / `IconButton`            | Radix Slot (asChild)              | [button/](src/shared/ui/button/)                 |
| `Card` (+ Header/Body/Footer)      | —                                 | [card/](src/shared/ui/card/)                     |
| `Carousel`                         | Embla + autoplay                  | [carousel/](src/shared/ui/carousel/)             |
| `Checkbox`                         | Radix Checkbox                    | [checkbox/](src/shared/ui/checkbox/)             |
| `Chip`                             | —                                 | [chip/](src/shared/ui/chip/)                     |
| `Dialog` (+ Provider/useDialog)    | Radix Dialog + react-dialog-async | [dialog/](src/shared/ui/dialog/)                 |
| `Icon` (32종)                      | inline SVG                        | [icon/](src/shared/ui/icon/)                     |
| `Input`                            | —                                 | [input/](src/shared/ui/input/)                   |
| `StepIndicator`                    | Radix Slider                      | [step-indicator/](src/shared/ui/step-indicator/) |
| `Tabs` (Root/List/Trigger/Content) | Radix Tabs                        | [tabs/](src/shared/ui/tabs/)                     |
| `Text`                             | cva                               | [text/](src/shared/ui/text/)                     |

각 컴포넌트는 같은 디렉토리의 `*.stories.tsx`에 스토리가 정의되어 있다. `pnpm storybook`으로 실행해 카탈로그를 확인할 수 있다.

## 시작하기

```bash
pnpm i
pnpm dev          # http://localhost:3000
pnpm storybook    # http://localhost:6006
```

### 주요 스크립트

| 명령                                | 설명                          |
| ----------------------------------- | ----------------------------- |
| `pnpm dev`                          | Next.js 개발 서버 (Turbopack) |
| `pnpm build`                        | 프로덕션 빌드                 |
| `pnpm start`                        | 빌드 결과 서빙                |
| `pnpm lint`                         | ESLint                        |
| `pnpm typecheck`                    | `tsc --noEmit`                |
| `pnpm format` / `pnpm format:check` | Prettier                      |
| `pnpm storybook`                    | Storybook 개발 서버           |
| `pnpm build-storybook`              | Storybook 정적 빌드           |

### 환경 변수

| 변수                      | 기본값                           | 설명                  |
| ------------------------- | -------------------------------- | --------------------- |
| `NEXT_PUBLIC_API_URL`     | `http://localhost:8000`          | 백엔드 API 베이스 URL |
| `NEXT_PUBLIC_APP_VERSION` | `package.json#version` 자동 주입 | 푸터/헬스체크용       |

## 컨벤션

### 라우팅 규칙

1. **라우트 그룹 필수 소속:** 모든 페이지는 `(auth)`, `(guest)`, `(member)` 중 하나에 속해야 한다. 유일한 예외는 `src/app/page.tsx` (개발용 라우트 인덱스).
2. **라우트 인덱스 동기화:** 신규 페이지 추가 시 `src/app/page.tsx`의 `ROUTES` 배열에 경로를 추가한다. tree 형태로 그룹별 소속과 페이지 연결을 표시한다.

### 버전 관리

SemVer (`x.y.z`). PR merge 시마다 `package.json#version`을 업데이트한다.

- **패치(z):** 간단한 수정, 버그 픽스
- **마이너(y):** API 사용 변경, 경로 변경
- **메이저(x):** 새로운 기능 추가, 최초 MVP 출시

### 의존성 관리

새로운 패키지/라이브러리 도입 시 반드시 팀 논의 후 승인을 받는다.

### 브랜치명

`^(main|develop|(feat|fix|hotfix|chore|docs|refactor|test)\/[a-z0-9._-]+)$`

`pre-push` 훅에서 [validate-branch-name](https://www.npmjs.com/package/validate-branch-name)이 검증한다.

### 커밋 메시지

[Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `hotfix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `build:`, `ci:`, `revert:`. `commit-msg` 훅에서 [commitlint](https://commitlint.js.org/)가 검증한다.

### 버전

SemVer. `package.json#version`이 단일 진실 소스이며, [next.config.ts](next.config.ts)가 `NEXT_PUBLIC_APP_VERSION`으로 자동 주입한다.
