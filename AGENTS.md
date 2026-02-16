# AGENTS.md

이 문서는 Codex(에이전트)가 이 저장소에서 작업할 때 따라야 할 우선 규칙을 정의한다.

## 문서 우선순위
1. `RULES.md`
2. `ARCHITECTURE.md`
3. `DESIGN.md`
4. `README.md`

충돌 시 상위 문서를 우선 적용한다.

## 작업 기본 원칙
- 요청 범위를 벗어난 파일은 수정하지 않는다.
- 기존 패턴(폴더 구조, 컴포넌트 스타일, 상태관리)을 먼저 재사용한다.
- 서버/클라이언트 경계를 유지한다.
- 인증/권한 로직은 서버 기준으로 검증한다.
- DB 스키마 변경은 반드시 `supabase/migrations`에 SQL 파일로 남긴다.

## 코드 배치 가이드
- 페이지: `src/app/**/page.tsx`
- API: `src/app/api/**/route.ts`
- 전역 상태: `src/stores`
- 인증/권한 유틸: `src/lib/auth`
- Supabase 유틸: `src/lib/supabase`
- 공용 UI: `src/components/shared`

## 인증/권한 가이드
- 클라이언트 인증 상태는 `zustand` 스토어를 단일 소스로 사용한다.
- 관리자 라우트는 서버단 보호(`requireAdmin`)가 필수다.
- 권한은 `profiles.is_admin` 우선, `ADMIN_EMAIL`은 fallback으로 사용한다.

## UI/UX 가이드
- 티꿀 톤(amber + slate)과 기존 컴포넌트 패턴을 유지한다.
- 반응형은 모바일 우선으로 구현한다.
- 저장/요청 동작은 로딩/에러 상태를 명확히 표시한다.

## 품질 가이드
- 변경 후 최소 `npx tsc --noEmit`를 통과해야 한다.
- 인증/권한/관리자 라우트 변경 시 수동 접근 테스트를 수행한다.
- API는 일관된 JSON 응답과 적절한 HTTP status를 사용한다.
