# ARCHITECTURE

## 시스템 개요
- 프론트엔드 중심 Next.js App Router 구조
- 데이터/인증은 Supabase 사용
- 크롤러는 API Route + Cron으로 주기 실행

## 폴더 구조
- `src/app`: 라우트, 페이지, API 핸들러
- `src/components`: UI 컴포넌트 (`layout`, `shared`, 도메인별)
- `src/lib`: Supabase 클라이언트/서버 유틸, 인증 유틸
- `src/stores`: Zustand 스토어
- `src/types`: DB/도메인 타입
- `supabase/migrations`: DB 마이그레이션 SQL

## 상태 관리 원칙
- 전역 상태: `zustand` (`src/stores`)
- 서버 데이터: Server Component에서 직접 Supabase 조회
- 클라이언트 인증 상태: `AuthProvider`에서 세션 동기화 후 store 반영

## 인증 흐름
1. 로그인 페이지에서 `supabase.auth.signInWithPassword`
2. `AuthProvider`가 `getSession` + `onAuthStateChange` 구독
3. `/api/me`를 통해 닉네임/아바타/관리자 여부 동기화
4. 헤더/마이페이지/관리자 접근에서 store + 서버 검사 사용

## 관리자 권한 원칙
- 1차: `profiles.is_admin = true`
- 2차 fallback: `.env.local`의 `ADMIN_EMAIL`과 로그인 이메일 일치
- 관리자 라우트는 `requireAdmin()`으로 서버단 보호

## API 설계 원칙
- 위치: `src/app/api/**/route.ts`
- 인증 필요 API는 서버에서 사용자 확인 후 처리
- 응답 형식은 일관된 JSON (`ok`, `error`, 주요 payload) 유지
- DB 스키마는 `tinyhoney`를 기준으로 사용

## 서버/클라이언트 분리 원칙
- 데이터 조회/권한 체크: Server Component 또는 API Route
- 상호작용 폼/드롭다운/세션 반응형 UI: Client Component
- 브라우저 전용 동작은 반드시 `"use client"` 파일에 한정
