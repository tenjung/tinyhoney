# 🐝 티꿀 TinyHoney
전국 핫딜/이벤트/커뮤니티 정보를 한 곳에서 모아보는 실시간 수집형 플랫폼입니다.

## 프로젝트가 해결하는 문제
- 커뮤니티마다 흩어진 핫딜 정보를 한 번에 확인하기 어렵다.
- 이벤트/커뮤니티 정보와 딜 정보가 분리되어 탐색 흐름이 끊긴다.
- 운영자 입장에서 데이터 품질과 등록 상태를 통합 관리하기 어렵다.

## 핵심 기능
- 멀티 소스 크롤러 기반 핫딜 수집 (`PPOMPPU`, `RULIWEB`, `QUASARZONE`, `CLIEN`, `FMKOREA`, `AMISAE`)
- 핫딜/이벤트/커뮤니티 통합 탐색
- Supabase Auth 로그인 + 사용자 프로필(닉네임/아바타) 반영
- 관리자 콘솔: 핫딜/이벤트/커뮤니티/등록 관리

## 기술 스택
- Frontend: Next.js 15 (App Router), TypeScript
- UI: TailwindCSS v4
- State: Zustand
- Backend/Data: Supabase (PostgreSQL, Auth, RLS)
- Deployment: Vercel + Cron

## 실행 방법
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

필수 환경변수:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

## 문서 구조
- `README.md`: 프로젝트 목적/정체성
- `ARCHITECTURE.md`: 시스템 구조/개발 패턴
- `DESIGN.md`: UI/UX 규칙
- `RULES.md`: 구현 시 필수 준수 규칙
