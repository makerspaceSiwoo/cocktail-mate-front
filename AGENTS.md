# CLAUDE.md — CocktailMate 프론트엔드 AI 작업 규칙

## 라우팅 규칙

### 1. 페이지는 반드시 라우트 그룹에 속해야 한다

모든 신규 페이지는 `(auth)`, `(guest)`, `(member)` 중 하나의 그룹 안에 생성한다.

- `(auth)` — 로그인/회원가입 등 인증 관련 페이지
- `(guest)` — 비로그인 사용자도 접근 가능한 페이지
- `(member)` — 로그인 필수 페이지

**유일한 예외:** `src/app/page.tsx` (루트 라우트 인덱스). 이 파일은 개발용 전체 경로 목록 페이지로, 그룹에 속하지 않는다. 이 외에 그룹 밖에 페이지를 만들지 않는다.

### 2. 신규 페이지 추가 시 루트 라우트 인덱스 업데이트

페이지를 추가하면 `src/app/page.tsx`의 `ROUTES` 배열에 해당 경로를 반드시 추가한다. tree 형태의 UI로 그룹별 소속과 페이지 간 연결 관계를 한눈에 파악할 수 있도록 한다.

## 버전 관리

### 3. PR merge 시 버전 업데이트

`package.json`의 `version` 필드를 SemVer(`x.y.z`)로 관리한다. 브랜치를 PR merge 할 때마다 버전을 업데이트한다.

- **패치(z):** 간단한 수정, 버그 픽스
- **마이너(y):** API 사용 변경, 경로 변경
- **메이저(x):** 새로운 기능 추가, 최초 MVP 출시

버전 판단은 개발자가 직접 한다. AI가 임의로 버전을 올리지 않으며, 개발자에게 버전 업데이트 여부를 확인한다.

## 디자인 타겟

### 4. 모바일 전용 · iPhone 14 Pro Max (430 × 932) 기준

웹 클라이언트는 **모바일 전용**이다. 데스크탑 레이아웃은 만들지 않는다. 기준 viewport는 **iPhone 14 Pro Max (430 × 932)**.

- 모든 신규 페이지·컴포넌트는 430 × 932 기준으로 작업한다.
- 레이아웃은 `flex` / `grid`를 우선 사용해 320 ~ 430px 범위에서 responsive하게 동작하도록 만든다 (mobile-first).
- 데스크탑 viewport에서는 컨텐츠를 430px 폭으로 가운데 정렬 + 좌우 여백 (`bg-bg` 등)으로 처리한다. PC 전용 분기 (`md:` / `lg:` 등 큰 breakpoint)는 추가하지 않는다.
- **고정 사이즈 지양**: `w-[400px]` 같은 고정 너비 대신 `w-full` + `max-w-[430px]` 패턴을 우선한다. 컴포넌트 내부도 부모 사이즈에 맞춰 늘어나도록 작성한다.
- 한 화면이 viewport 세로보다 길 때만 세로 스크롤을 허용한다. 가로 스크롤은 carousel 등 명시적으로 의도된 경우 외에 발생하지 않도록 한다.

## 의존성 관리

### 5. 새로운 패키지/라이브러리 도입 금지 (사전 승인 필수)

AI가 임의로 새로운 패키지나 라이브러리를 설치하지 않는다. 도입이 필요한 경우 반드시 개발자에게 다음을 보고한다:

- 패키지명과 용도
- 대안이 없는 이유
- 번들 사이즈 영향

개발자의 승인 없이 `pnpm add`를 실행하지 않는다.

## Next.js / React 컨벤션

### 컴포넌트 작성

- **Server Component 우선:** 클라이언트 상태나 브라우저 API가 필요한 경우에만 `"use client"`를 사용한다.
- **컴포넌트 파일명:** kebab-case (`search-bar.tsx`). 컴포넌트 이름은 PascalCase (`SearchBar`).
- **default export:** 페이지(`page.tsx`), 레이아웃(`layout.tsx`)에 사용한다. 공용 컴포넌트는 named export를 사용한다.
- **컴포넌트 정의:** 함수 선언문(`function Component()`) 또는 화살표 함수 + `const`를 프로젝트 기존 스타일에 맞춰 사용한다.

### 상태 관리 및 데이터 페칭

- **서버 사이드 데이터 페칭:** `async` Server Component에서 직접 fetch한다. 클라이언트에서 불필요하게 데이터를 가져오지 않는다.
- **클라이언트 상태:** 최소한으로 유지한다. URL 상태(`searchParams`)를 적극 활용한다.
- **Props drilling 3단계 이상 금지:** 깊어지면 합성(composition) 패턴이나 Context를 사용한다.

### 스타일링

- **Tailwind CSS 사용:** 인라인 스타일이나 CSS 모듈을 사용하지 않는다.
- **디자인 토큰:** `globals.css`에 정의된 CSS 변수를 사용한다. 하드코딩된 색상값 금지.
- **반응형:** mobile-first로 작성한다.

### 성능

- **이미지:** `next/image`를 사용한다. `<img>` 태그 직접 사용 금지.
- **폰트:** `next/font` 또는 기존 CDN 설정을 따른다.
- **동적 import:** 무거운 컴포넌트는 `next/dynamic`으로 lazy load한다.
- **metadata:** 각 페이지에 적절한 `metadata` export를 추가한다.

### 프로젝트 구조 (가벼운 FSD)

```
src/
├── app/           # 라우팅 전용. 비즈니스 로직 최소화.
├── entities/      # 도메인 모델, 타입, 픽스처
├── features/      # 도메인별 기능 슬라이스
├── shared/
│   ├── ui/        # 공용 UI 컴포넌트 (디자인 시스템)
│   ├── lib/       # 유틸리티 함수
│   ├── api/       # API 호출 래퍼
│   ├── config/    # 설정, 환경변수
│   ├── hooks/     # 공용 훅
│   └── types/     # 공용 타입
```

- `app/` 디렉토리에는 라우팅과 레이아웃 관련 코드만 둔다. 비즈니스 로직은 `features/` 또는 `entities/`에 작성한다.
- 공용 컴포넌트는 반드시 `shared/ui/`에 위치한다.
- 계층 간 import 방향: `app → features → entities → shared`. 역방향 import 금지.

### 에러 처리

- 각 라우트 그룹에 `error.tsx`와 `not-found.tsx`를 적절히 배치한다.
- `loading.tsx`로 Suspense boundary를 활용한다.

### 접근성

- 시맨틱 HTML 태그를 사용한다 (`<main>`, `<nav>`, `<section>`, `<article>` 등).
- 인터랙티브 요소에 적절한 `aria-label`을 제공한다.
- 키보드 네비게이션을 지원한다.

### 테스트

- 컴포넌트 스토리는 해당 컴포넌트와 같은 디렉토리에 `*.stories.tsx`로 작성한다.
- 신규 공용 컴포넌트를 만들면 Storybook 스토리를 함께 작성한다.
