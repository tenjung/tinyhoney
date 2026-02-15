# TGMOA (Tiny Honey)

핫딜 수집 + 커뮤니티 + 이벤트 기능을 제공하는 Rails 8 서비스입니다.
이 문서는 다음 에이전트/개발자가 빠르게 이어받기 위한 인수인계용 요약입니다.
빠른 온보딩 체크리스트는 `AGENTS.md`를 참고하세요.

## 1) 서비스 개요

- 메인: 최근 딜 + 최저가 딜 노출 (`DashboardController`)
- 딜: 목록/상세 조회 (`DealsController`)
- 커뮤니티: 게시판/글/댓글 (`Boards`, `Posts`, `Comments`)
- 이벤트: 이벤트 등록/조회 (`EventsController`)
- 관리자: 딜/유저 관리 (`Admin::*`)
- 인증: Devise + OAuth(Google, Naver)
- 알림: 키워드 매칭 시 ActionCable + 메일 발송

## 2) 핵심 경로 맵

- 라우팅: `config/routes.rb`
- 대시보드: `app/controllers/dashboard_controller.rb`
- 딜 모델: `app/models/deal.rb`
- 사용자 모델: `app/models/user.rb`
- 크롤링 잡: `app/jobs/crawl_deals_job.rb`
- 크롤러 공통: `app/services/crawlers/base_crawler.rb`
- 개별 크롤러: `app/services/crawlers/*_crawler.rb`
- 관리자 권한 체크: `app/controllers/admin/base_controller.rb`
- OAuth 콜백: `app/controllers/users/omniauth_callbacks_controller.rb`

## 3) 실행 방법 (권장: Docker)

### 실행

```bash
docker compose up -d db web
```

### 접속 주소

- 앱: `http://localhost:3000`
- 헬스체크: `http://localhost:3000/up`

### 상태 확인

```bash
docker compose ps
docker compose exec -T web curl -i http://localhost:3000/up
```

### 종료

```bash
docker compose down
```

## 4) 테스트

```bash
docker compose up -d db web
docker compose exec -T web bin/rails db:environment:set RAILS_ENV=test
docker compose exec -T web bin/rails test
```

현재 기준 전체 테스트 통과 상태입니다.

## 5) 크롤링/알림 동작

- 개발 환경 스케줄: `config/recurring.yml`
  - `crawl_deals`가 5분마다 실행
- 실행 잡: `CrawlDealsJob`
  - PPOMPPU/Ruliweb/Quasarzone/Amisae/Clien/ArcaLive 크롤러 호출
- 저장 로직:
  - URL 기준 upsert 유사 처리 (`find_or_initialize_by`)
  - 신규 생성/가격 변경 시 `PriceHistory` 기록 및 유저 알림

## 6) 인증/OAuth 설정

활성 소셜 로그인 공급자:

- Google (`google_oauth2`)
- Naver (`naver`)

필수 환경 변수:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`

참고:

- `kakao` 콜백/의존성은 정리되어 현재 비활성 상태입니다.

## 7) 개발 환경 전제 조건 (로컬 직접 실행 시)

- Ruby `3.3.0` (`.ruby-version`)
- Node `18.20.4` (`.node-version`)
- Yarn 1.x
- PostgreSQL

```bash
bin/setup
bin/dev
```

## 8) 최근 반영 사항 (인수인계)

- `minitest 6.x`와 Rails 8.0.4 테스트 러너 충돌 이슈 대응
  - `Gemfile` test 그룹에 `gem "minitest", "~> 5.25"` 추가
- 기본 테스트 템플릿 불일치 수정
  - 관리자 컨트롤러 테스트 라우트/helper 및 로그인 처리 정리
  - 메일러 테스트 시그니처/기대값 정리
  - `users` fixture 중복 이메일 수정
- README를 인수인계 중심으로 재작성

## 9) 배포 가이드 (Kamal)

이 프로젝트는 `kamal`을 사용하여 AWS Lightsail(또는 VPS)에 배포됩니다.

### 주요 명령어

- **배포 (빌드 + 배포)**:
  ```bash
  bundle exec kamal deploy
  ```
- **환경 변수 갱신**:
  ```bash
  bundle exec kamal env push
  ```
- **로그 확인**:
  ```bash
  bundle exec kamal app logs -f
  ```
- **Rails Console 접속**:
  ```bash
  bundle exec kamal app exec -i 'bin/rails console'
  ```

### 배포 관련 중요 사항
- **DB 마이그레이션**: `kamal deploy` 과정에서 마이그레이션이 포함되어 있으나, 충돌 발생 시 수동 조치가 필요할 수 있습니다.
- **이미지**: Docker Hub (`tenjung/tgmoa`)를 사용합니다.

## 10) 트러블슈팅 히스토리 (Troubleshooting)

### 2026-02-15: SolidQueue 마이그레이션 충돌 해결 및 배포 성공
- **상황**: `rename_solid_queue_process_kind_to_name` 마이그레이션 파일이 로컬엔 있으나 배포 시 `PG::DuplicateColumn` 오류 발생.
- **원인**: 이전 배포 컨테이너(구버전) 내에서 `db:migrate`를 실행하려 했으나, DB에는 이미 컬럼이 존재하고 구버전 코드에는 해당 마이그레이션 파일이 있어 충돌.
- **해결**:
  1. 로컬에서 충돌 유발 마이그레이션 파일 삭제 & 커밋 (`Fix: Remove redundant SolidQueue rename migrations`).
  2. `kamal app exec ... db:migrate` 단계 건너뛰고 바로 `bundle exec kamal deploy` 실행.
  3. 새 이미지(마이그레이션 파일 제거됨)로 배포되어 충돌 없이 완료.
- **현재 상태**: 배포 성공 (Version `6c3309a`)

## 11) UI/UX 가이드

- **모바일 우선 (Mobile First)**: 모든 UI는 모바일 환경에서의 가독성과 사용성을 최우선으로 고려합니다.
- **반응형 디자인**: TailwindCSS의 Breakpoint(`md`, `lg` 등)를 활용하여 데스크탑까지 유연하게 확장합니다.
- **스켈레톤 로딩**: 데이터 로딩 시 빈 화면 대신 스켈레톤 UI를 노출하여 체감 속도를 높입니다.