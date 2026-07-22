---
id: winterbloooom
name: winterbloooom
site: https://winterbloooom.github.io
owner: EunGi Han (한은기)
type: personal-tech-blog
stack: { ssg: Jekyll, deploy: GitHub Actions, comments: Disqus, search: Pagefind }
fonts: { policy: system-only, sans: OS default sans, mono: OS default mono }
accent: "#2748e0"
themes: [light, dark]
status: approved (Phase 0, 2026-07-22)
source_of_truth: plans/blog-redesign.md
---

# Design System — winterbloooom.github.io

이 문서는 개인 기술 블로그 `winterbloooom.github.io` 리디자인의 **단일 디자인 기준서**다.
새 화면·컴포넌트·템플릿을 만들 때 이 문서의 토큰과 규칙을 그대로 따른다. 값은 현재 시점의
스냅샷이며, 바뀌면 이 문서를 제자리에서 갱신한다(변경 이력은 git log). 전체 리디자인 맥락은
`plans/blog-redesign.md` 참고.

> **읽는 순서:** 원칙(§1) → 금지사항(§7)을 먼저 읽어라. 이 블로그의 정체성은 "무엇을 하느냐"보다
> "무엇을 하지 않느냐"로 정의된다. 세 가지 금지(세리프+웜톤 / 카드 컬러 라인 / 작은 글씨)를 어기면
> 이 디자인이 아니다.

---

## 1. Visual Theme & Atmosphere

로보틱스·컴퓨터비전·딥러닝을 공부하는 연구자의 **정돈된 연구 노트**. 순백 배경 위에 검정 텍스트,
넓은 여백, 얇은 구분선으로 콘텐츠를 흐르게 한다. 장식적 이미지·그림자·색면을 배제하고, 색은
극도로 아껴 링크와 카테고리 표식에만 쓴다.

- **밀도(Density):** 4 / 10 — "매일 읽는 앱" 균형. 넉넉하지만 비어 보이지 않게.
- **변주(Variance):** 3 / 10 — 예측 가능한 정렬. 텍스트 가독성이 실험적 레이아웃보다 우선.
- **모션(Motion):** 2 / 10 — 절제. 호버 색 전환·부드러운 페이드 정도. 무한 루프 애니메이션 없음.

메타 정보(카테고리·날짜·태그)를 **모노스페이스**로 처리해 본문과 대비시키는 것이 이 블로그의
시그니처다 — "코드를 다루는 사람의 기록"이라는 인상을 준다.

---

## 2. Color Palette & Roles

순백·잉크·회색조 뉴트럴 + **단일 accent(블루)**. accent는 상호작용(링크·활성·호버)에만 쓰고,
카테고리 구분은 별도의 **시맨틱 카테고리 색**을 **작은 점(dot)** 으로만 표현한다. 뉴트럴은 파랑 쪽으로
아주 미세하게 치우친 쿨 그레이로 통일한다(웜 그레이 혼용 금지).

### 2.1 Light (기본)

| 이름 | Hex | 역할 |
|---|---|---|
| Canvas | `#ffffff` | 페이지 배경 (`--bg`) |
| Soft Surface | `#f5f6f8` | 태그 pill 배경, 썸네일 placeholder, 미묘한 면 (`--bg-soft`) |
| Ink | `#15171c` | 본문·제목 기본 텍스트 (`--ink`) — 순수 검정 아님 |
| Ink Soft | `#565b66` | 요약·설명·보조 텍스트 (`--ink-soft`) |
| Ink Faint | `#8a8f9a` | 메타·날짜·placeholder (`--ink-faint`) |
| Line | `#e8e9ed` | 구분선, 1px 헤어라인 (`--line`) |
| Line Strong | `#d3d5db` | 버튼·칩 테두리, 강한 구분 (`--line-strong`) |
| Accent | `#2748e0` | 링크·활성 네비·호버·제목 호버·focus ring (`--accent`) |
| Accent Soft | `#eaeeff` | 본문 하이라이트(`<mark>`) 배경 (`--accent-soft`) |

### 2.2 Dark

| 이름 | Hex | 역할 |
|---|---|---|
| Canvas | `#0e1013` | `--bg` |
| Soft Surface | `#181b20` | `--bg-soft` |
| Ink | `#eef0f3` | `--ink` |
| Ink Soft | `#a2a8b3` | `--ink-soft` |
| Ink Faint | `#71767f` | `--ink-faint` |
| Line | `#23262c` | `--line` |
| Line Strong | `#34383f` | `--line-strong` |
| Accent | `#7d93ff` | `--accent` — 어두운 배경에서 대비 확보 위해 밝게 |
| Accent Soft | `#1a2036` | `--accent-soft` |

### 2.3 Category Semantic Palette (점 전용)

카테고리 최상위 6종에 고정 색을 부여한다. **오직 지름 8–9px 원형 점**으로만 노출한다.
카드 테두리·좌측 라인·배경 틴트로 쓰지 않는다(§7 참고).

| 카테고리 | Light | Dark |
|---|---|---|
| Robotics | `#d1603a` | `#e88259` |
| AI | `#7b4bd4` | `#a683ef` |
| Programming | `#2f9e6f` | `#4fc492` |
| Dev | `#c79214` | `#e0b23e` |
| Computer Science | `#1f8aa3` | `#4bb6cf` |
| Math | `#c4415f` | `#e46a86` |

**테마 구현:** 모든 색은 `:root` CSS 변수로 선언한다. `@media (prefers-color-scheme: dark)`로 OS
선호를 받고, `:root[data-theme="dark"]` / `[data-theme="light"]`가 사용자 토글로 이를 덮어쓴다.
컴포넌트는 항상 토큰(변수)을 통해 색을 참조하고, 미디어쿼리 안에서 색을 직접 박지 않는다.

---

## 3. Typography Rules

**웹폰트를 별도로 로드하지 않는다 — OS 기본 폰트만 사용한다** (사용자 결정, 2026-07-23).
성능을 위해 다운로드되는 폰트 파일이 없다. 두 가지 역할(본문/제목 = 시스템 sans, 메타/태그 = 시스템 mono)로만 쓴다.
세리프는 전면 금지(§7).

- **본문/제목 (sans):** `system-ui, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", "Malgun Gothic", Roboto, "Noto Sans KR", sans-serif`
  → macOS: San Francisco + Apple SD Gothic Neo / Windows: Segoe UI + Malgun Gothic / Android·기타: Roboto + Noto Sans KR
- **메타/태그·라벨 (mono):** `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`
  → 각 OS의 기본 모노(SF Mono / Consolas 등)

| 역할 | Font | Size | Weight | Tracking | 비고 |
|---|---|---|---|---|---|
| 본문(body) | system sans | 18px | 400 | 0 | line-height 1.75. 이 값 미만 금지 |
| 인트로 이름(hero) | system sans | 2.7rem | 800 | -0.03em | 홈 상단 이름 |
| 포스트 제목(상세) | system sans | 2.3rem | 800 | -0.025em | line-height 1.25 |
| 리스트 제목 | system sans | 1.5rem | 700 | -0.02em | 홈/아카이브 글 제목 |
| 섹션 헤딩 | system sans | 1.35rem | 800 | -0.02em | "Latest" 등, 하단 2px 보더 |
| prose h2 | system sans | 1.5rem | 800 | -0.02em | 본문 소제목 |
| bio/dek | system sans | 1.15rem | 400 | 0 | 인트로 소개문, max 34em |
| 메타·날짜·카테고리 라벨 | system mono | 0.82rem | 400–500 | 0.02em | 대문자 라벨은 약간의 자간 |
| 태그 | system mono | 0.76rem | 400 | 0 | 회색 pill |

**규칙**
- 제목은 크기보다 **weight(700–800)와 tight tracking(음수 자간)** 으로 위계를 만든다. 무작정 키우지 않는다.
  (시스템 폰트가 800을 지원하지 않으면 700으로 폴백 — 허용.)
- 본문 측정폭은 최대 44em(≈65자) 이내로 유지한다.
- **줄바꿈**: 전 페이지에서 한글은 어절(띄어쓰기) 단위로만 끊는다 — `body { word-break: keep-all; overflow-wrap: break-word; }`.
  글자 중간에서 잘리지 않게 하고, 긴 영문/URL 만 넘칠 때 끊는다.
- 위계는 무게·색으로. 같은 글에서 색을 텍스트에 입히지 않는다(accent는 링크/호버 한정).
- `@font-face` 선언·`<link rel=preload>` 폰트·웹폰트 CDN 도입 금지.

---

## 4. Component Stylings

공통 원칙: 카드형 박스·그림자·구분선을 기본으로 쓰지 않는다. **구획은 여백으로만** 나눈다(divider 금지, §5).

- **Header (sticky):** 배경 90% 불투명 + `backdrop-filter: blur(10px)`, 하단 1px `--line`(앱 프레임 경계 — 콘텐츠 divider 아님).
  워드마크는 `winter`+`bloooom`, 뒤 절반만 accent. 네비 활성 링크는 하단 2px accent 언더라인.
  우측에 검색·테마토글 아이콘 버튼(38px, 호버 시 `--bg-soft`).
- **Post item (통일 컴포넌트 — 단일 `_includes/post-item.html`):** 홈·`/posts/`·카테고리 아카이브·검색이 **모두 이 하나**를 호출한다(이원화 금지).
  jekyll-origin `/blog-2/` 행 스타일.
  - **teaser 있는 글:** `grid: [thumb 200px] [body 1fr]`, gap 30px. 좌측 200×130 썸네일.
  - **teaser 없는 글:** 단일 컬럼(텍스트 전용).
  - **body 구성:** 메타라인(카테고리 dot + 모노 `Lv1 · Lv2` + `—` + 날짜) → 제목(1.5rem/700) → 요약(1.02rem/`--ink-soft`) → 태그.
  - **하이퍼링크는 제목만.** 래퍼는 `<article>`(링크 아님), 썸네일도 `<div>`. 아이템당 링크 1개.
  - **호버: 색 변화 없이 밑줄만** — `text-decoration: underline; currentColor; 2px; offset 4px`. 행 전체 호버 배경 없음
    (클릭 불가 영역이 클릭 가능해 보이면 안 되므로).
  - **구분선 없음** — 아이템 간 여백(`padding: 26px 0`)으로만 구분.
  - 모바일(≤680px): 단일 컬럼, 썸네일 전폭 170px.
- **Category dot:** 8–9px 원, 해당 카테고리 시맨틱 색. 메타라인·필터칩·breadcrumb에만.
- **Filter chip:** pill, 1px `--line-strong` 테두리 + 앞쪽 카테고리 dot. active는 `--ink` 배경 + `--bg` 텍스트.
- **Tag:** 모노 0.76rem, `--bg-soft` 배경 pill, 라운드 6px. 테두리·색 없음.
- **Links / Buttons:** 텍스트 링크는 accent. 인트로의 primary 버튼은 `--ink` 채움 + `--bg` 텍스트,
  나머지는 1px `--line-strong` 아웃라인 pill. 외곽 글로우·네온 그림자 금지. active 시 미세한 눌림 정도만.
- **Prose `<mark>`:** `--accent-soft` 배경, `--ink` 텍스트. 형광 노랑 금지.
- **Blockquote:** 좌측 3px accent 보더 + `--ink-soft` 텍스트. (본문 인용은 예외적으로 accent 라인 허용 —
  이는 카드가 아니라 인용 표식이므로 §7의 "카드 컬러 라인" 금지와 무관.)
- **Comments (Disqus):** 스크롤 진입(IntersectionObserver, rootMargin 400px) 또는 "댓글 보기" 버튼 클릭 시 지연 로드.
  로드 전에는 점선 테두리 placeholder. 우리 코드에는 어떤 광고도 없다.
- **Search:** 현재는 `search.json` + 클라이언트 필터(제목·카테고리·태그). Phase 5 에서 Pagefind 로 전환 예정.

---

## 5. Layout Principles

- **홈은 블로그 인덱스가 아니라 퍼스널 웹사이트로 성장한다.** 섹션 단위(모듈)로 구성해 앞으로 Projects·Now 등 블록을
  자유롭게 추가할 수 있게 잡는다. 현재: 인트로(사진 placeholder·이름·핸들·**모노 role 라인**·bio·링크) →
  섹션 헤더(모노 eyebrow + 타이틀, 보더 없음) → 카테고리 필터칩 → **통일 포스트 리스트**(§4, 최근 8개). max-width 720px.
- **`/posts/` · 카테고리 아카이브** (max-width 960px): 홈과 **완전히 동일한 포스트 아이템**(§4)을 재사용.
- **포스트 상세** (max-width 980px, 본문 + 우측 200px sticky TOC 레일): breadcrumb → 제목 → 모노 메타 → prose.
- **구분선 금지 — 구획은 여백으로만.** 리스트 아이템·섹션 헤더·포스트 헤더 사이에 divider 라인을 두지 않는다.
  (예외: 표·코드블록·콜아웃·TOC 레일·입력창 등 **기능 요소의 보더**, 그리고 헤더/푸터의 앱 프레임 경계선은 허용.)
- 색면·그림자로 영역을 구분하지 않는다. 콘텐츠 폭은 max-width로 가두고, `calc()` 퍼센트 해킹 대신 grid/`gap` 정렬.

---

## 6. Responsive Behavior

- **< 680px:** 본문 17px로 축소. 인트로 이름 2.1rem, 리스트 제목 1.3rem.
- **아카이브 행:** 680px 이하에서 썸네일이 본문 위로 쌓이며 단일 컬럼(`grid-template-columns: 1fr`,
  썸네일 `width:100%`).
- **네비:** 좁은 화면에서 상단 텍스트 네비를 감추고 별도 메뉴로(모바일 메뉴).
- 가로 스크롤 절대 금지. 표·코드·다이어그램은 자체 `overflow-x:auto` 컨테이너 안에서만 스크롤.
- 터치 타깃 최소 44px. 아이콘 버튼 38–44px 유지.

---

## 7. Do's & Don'ts

### ✅ Do
- 흰 배경 + 검정(잉크) 텍스트를 기본으로.
- 색은 아껴서: accent 블루는 링크·활성·호버, 카테고리 색은 **점(dot)** 으로만.
- 본문 18px / line-height 1.75 이상.
- 메타 정보는 모노스페이스로 본문과 대비.
- 목록은 여백과 얇은 divider로 구분.
- 공통 마크업(글 카드/행)은 단일 include로 선언해 재사용.

### 🚫 Don't (프로젝트 고유 금지 — 사용자 피드백으로 확정)
- **세리프 폰트 + 웜톤(크림) 배경 조합 금지.** "누가 봐도 AI 스타일"로 반려된 조합.
- **카드/박스의 좌측·상단 컬러 라인(accent bar) 금지.** AI 티 나는 핵심 패턴.
- **작은 본문(16px 이하) 금지.**
- 카테고리 색을 카드 테두리·배경 틴트로 확장 금지(점 외 사용 금지).
- 순수 검정 `#000000` 금지(잉크 `#15171c` 사용).
- 형광/네온 하이라이트, 외곽 글로우 그림자 금지.
- 의미 없는 장식 썸네일을 강조하는 이미지 우선 레이아웃 금지.
- 무한 루프 애니메이션·바운스·스프링 오버슈트 금지(읽는 블로그에 과함).
- 이모지를 UI 구조 요소로 사용 금지.
- 웹폰트 별도 로드 금지 — OS 기본 폰트만(§3). `@font-face`·폰트 preload·웹폰트 CDN 도입 금지.

---

## 8. Motion & Interaction

절제가 원칙. 상호작용 피드백만 남기고 이목을 끄는 모션은 두지 않는다.

- 호버: 링크·제목 색이 accent로 전환(`transition` 0.15–0.2s ease). 네비 언더라인 등장.
- 테마 토글: 즉각 전환. 과한 크로스페이드 없음.
- 애니메이션은 `transform`/`opacity`만. `top/left/width/height` 애니메이션 금지.
- `prefers-reduced-motion: reduce`에서 모든 transition 제거.
- 무한 루프·자동 캐러셀·스크롤 유도 화살표 없음.

---

## 9. Iconography & Assets

- 아이콘은 **인라인 SVG `<symbol>` 스프라이트**. Font Awesome CDN/kit 제거.
- stroke 기반, `stroke-width` 1.6, `currentColor` 상속. 크기 13–20px.
- 프로필 사진은 실제 이미지가 준비되기 전까지 원형 placeholder(`[ PHOTO PLACEHOLDER ]`).
- 폰트는 로드하지 않는다 — OS 기본 폰트만 사용(§3). 다운로드되는 폰트 파일 0개 → 폰트 관련 성능 최적화 자체가 불필요.

---

## 10. Agent Prompt Guide

새 화면/컴포넌트를 만들 때 이 문서를 프롬프트에 동봉하고 다음을 강제한다:

1. 색은 §2의 CSS 변수로만 참조. 하드코딩 hex 금지, 미디어쿼리 안에 색 직접 삽입 금지.
2. 서체는 OS 기본 sans/mono 두 역할만(§3). 웹폰트 로드·세리프 도입 금지.
3. 글 목록/카드 마크업은 기존 include를 재사용. 새 변형이 필요하면 include에 파라미터를 추가.
4. 새 컴포넌트도 §7의 Don't를 통과해야 함 — 특히 컬러 라인·작은 글씨·웜톤·세리프.
5. light/dark 두 테마를 모두 구현하고, 대비(accent가 양쪽 배경에서 읽히는지)를 확인.
6. 반응형: 680px 이하 단일 컬럼, 가로 스크롤 0.

---

_승인: Phase 0 (2026-07-22). 근거 시안: v3. 상세 계획: `plans/blog-redesign.md`._
