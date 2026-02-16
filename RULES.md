# RULES

## 1. 변경 범위 규칙
- 요청 범위 밖의 파일/기능은 수정하지 않는다.
- 기존 동작을 바꾸는 경우 이유와 영향도를 명시한다.
- 데이터 스키마 변경은 반드시 `supabase/migrations`에 SQL로 남긴다.

## 2. 코드 배치 규칙
- 페이지: `src/app/**/page.tsx`
- API: `src/app/api/**/route.ts`
- 전역 상태: `src/stores`
- 인증/권한 유틸: `src/lib/auth`
- Supabase 클라이언트 래퍼: `src/lib/supabase`

## 3. 인증/권한 규칙
- 인증 관련 UI 상태는 `zustand` 스토어를 단일 소스로 사용한다.
- 관리자 페이지는 서버단에서 `requireAdmin()`으로 보호한다.
- 권한 판단은 `profiles.is_admin`을 우선 사용하고 `ADMIN_EMAIL`은 fallback으로만 사용한다.

## 4. UI 구현 규칙
- 기존 톤(amber + slate)과 컴포넌트 스타일을 유지한다.
- 컴포넌트 중복 작성보다 기존 shared 컴포넌트를 우선 확장한다.
- 모바일 뷰에서 깨지는 고정 폭 레이아웃을 만들지 않는다.

## 5. API/에러 처리 규칙
- API는 성공/실패가 명확한 JSON을 반환한다.
- 사용자 입력 검증 실패는 4xx, 서버 처리 실패는 5xx를 사용한다.
- 사용자에게는 이해 가능한 한국어 에러 메시지를 제공한다.

## 6. 데이터 접근 규칙
- 서버 데이터 조회는 가능하면 Server Component에서 처리한다.
- 클라이언트에서 민감키(`service_role`)를 절대 사용하지 않는다.
- `tinyhoney` 스키마를 기준으로 쿼리한다.

## 7. 품질 규칙
- 변경 후 최소 `npx tsc --noEmit` 확인
- 큰 기능 추가 시 라우트 접근/권한/기본 동작 수동 테스트
- 문서 구조를 변경하면 `README.md`의 문서 안내를 업데이트한다.
