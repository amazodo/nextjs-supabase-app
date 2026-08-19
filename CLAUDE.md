# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**Next.js 15 + Supabase 기반 풀스택 애플리케이션**

- **프레임워크**: Next.js 15.3.1 (App Router)
- **React**: 19.0.0
- **데이터베이스**: Supabase (PostgreSQL + Auth)
- **스타일링**: Tailwind CSS 3.4.1
- **UI 컴포넌트**: shadcn/ui + Radix UI
- **언어**: TypeScript 5
- **인증**: Supabase Auth (SSR 쿠키 기반)

## 개발 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 코드 린트 검사
npm run lint
```

## 프로젝트 구조

```
src/app/              # Next.js App Router 페이지
├── layout.tsx        # 루트 레이아웃 (Supabase 세션 설정)
├── page.tsx          # 홈페이지
├── login/            # 로그인 페이지
├── signup/           # 회원가입 페이지
└── ...

src/components/       # React 컴포넌트
├── ui/              # shadcn/ui 기본 컴포넌트
├── layout/          # 레이아웃 컴포넌트
├── sign-up-form.tsx # 회원가입 폼 (Supabase Auth 통합)
└── ...

src/lib/             # 유틸리티 및 설정
├── supabase/        # Supabase 클라이언트 설정
│   ├── client.ts    # 클라이언트 사이드 클라이언트
│   ├── server.ts    # 서버 사이드 클라이언트
│   └── profiles.ts  # 유저 프로필 관련 함수
├── utils.ts         # 공용 유틸리티 함수
└── env.ts           # 환경변수 검증

src/hooks/           # 커스텀 React 훅
types/               # TypeScript 타입 정의
docs/guide/          # 개발 가이드 문서
```

## 핵심 아키텍처

### Supabase 인증 흐름

1. **환경변수 설정**
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase Publishable Key

2. **클라이언트 설정** (`lib/supabase/client.ts`)
   - 브라우저에서 사용하는 Supabase 클라이언트
   - 쿠키 기반 세션 관리 (SSR 지원)

3. **서버 설정** (`lib/supabase/server.ts`)
   - 서버 컴포넌트/API 라우트에서 사용
   - 서버 사이드 세션 및 데이터베이스 접근

4. **Server Components에서의 인증**
   ```typescript
   // app/page.tsx 예제
   export default async function Page() {
     const supabase = await createClient()
     const { data: { user } } = await supabase.auth.getUser()
     // ...
   }
   ```

### Server vs Client Components 원칙

- **Server Components (기본값)**: 데이터 페칭, 인증 확인, 데이터베이스 접근
- **Client Components ('use client')**: 상호작용, 상태 관리, 이벤트 핸들러
- **경계**: 상호작용이 필요한 작은 단위로 'use client' 적용

### 개발 가이드 문서

상세한 가이드는 `docs/guide/` 폴더에 있습니다:

- **project-structure.md**: 파일/폴더 구조, 네이밍 컨벤션
- **component-patterns.md**: 컴포넌트 작성 패턴, 성능 최적화
- **nextjs-15.md**: Next.js 15.5.3 필수 규칙, 새로운 기능
- **styling-guide.md**: Tailwind CSS + shadcn/ui 사용법
- **forms-react-hook-form.md**: React Hook Form 통합 패턴

## 중요한 파일

### Supabase 설정 파일

- `lib/supabase/client.ts` - 클라이언트 Supabase 인스턴스 (쿠키 기반)
- `lib/supabase/server.ts` - 서버 Supabase 인스턴스
- `lib/supabase/profiles.ts` - 유저 프로필 관련 데이터베이스 함수

### 레이아웃 & 라우팅

- `app/layout.tsx` - Supabase 세션 공급자 설정
- `app/page.tsx` - 홈페이지
- `app/signup/page.tsx` - 회원가입 페이지
- `app/login/page.tsx` - 로그인 페이지

## 개발 워크플로우

### 1. 새 페이지 추가

```bash
# 1. app 폴더에 경로 생성
app/dashboard/page.tsx

# 2. Server Component로 작성 (기본값)
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')
  
  return <div>...</div>
}
```

### 2. 새 컴포넌트 추가

```bash
# 1. 컴포넌트 파일 생성 (kebab-case)
components/profile-card.tsx

# 2. 필요시 'use client' 선언 (상호작용 필요한 경우만)
'use client'
export function ProfileCard({ user }: { user: User }) {
  return <div>...</div>
}
```

### 3. 데이터베이스 함수 추가

```bash
# lib/supabase/profiles.ts에 함수 추가
export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return data
}

# 서버 컴포넌트에서 사용
const profile = await getUserProfile(user.id)
```

## 코딩 규칙 (프로젝트 특정)

### Supabase 사용 규칙

- ✅ 클라이언트 생성은 `lib/supabase/client.ts`, `lib/supabase/server.ts` 사용
- ✅ DB 함수는 `lib/supabase/` 폴더에 정의
- ❌ 컴포넌트에서 직접 Supabase 클라이언트 생성 금지
- ❌ 클라이언트 컴포넌트에서 서버 전용 함수 호출 금지

### TypeScript 규칙

- ✅ 모든 함수에 명확한 타입 정의
- ✅ `any` 타입 금지 (전역 설정)
- ✅ Supabase 타입 생성: `npx supabase gen types typescript --schema public > types/supabase.ts`

### 스타일링 규칙

- ✅ Tailwind CSS만 사용
- ✅ shadcn/ui 컴포넌트 활용
- ✅ 커스텀 CSS는 필요시 `globals.css`에만 추가
- ❌ 인라인 스타일 금지

## Supabase 로컬 개발

### 로컬 Supabase 설정 (선택사항)

```bash
# Supabase CLI 설치
npm install -g supabase

# 로컬 스택 시작
supabase start

# 환경변수 설정
# .env.local 파일에 로컬 URL 및 키 설정
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_local_key
```

## 환경변수 설정

`.env.local` 파일 생성 (버전 관리에서 제외):

```env
# Supabase 공개 키 (NEXT_PUBLIC_ 접두사 = 클라이언트 노출 가능)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

# 필요시 추가 환경변수
```

## 디버깅 팁

### Supabase 인증 문제

```typescript
// 서버에서 현재 사용자 확인
const supabase = await createClient()
const { data: { user }, error } = await supabase.auth.getUser()
console.log('User:', user, 'Error:', error)

// 클라이언트에서 세션 확인
const { data: { session } } = await supabase.auth.getSession()
```

### 데이터베이스 쿼리 테스트

Supabase 대시보드의 SQL Editor에서 쿼리 테스트 후, 동일한 로직을 TypeScript로 구현

## 자주 사용하는 명령어

```bash
# 타입 생성 (Supabase 스키마 변경 후)
npx supabase gen types typescript --schema public > types/supabase.ts

# 의존성 설치/업데이트
npm install
npm update

# 빌드 검증
npm run build

# 린트 검사
npm run lint
```

## 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- 프로젝트 가이드: `docs/guide/` 폴더의 마크다운 파일들
