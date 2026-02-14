# AGENTS.md

## 5분 온보딩 체크리스트

1. 저장소 상태 확인
- `git status --short`
- 의도치 않은 변경/미추적 파일이 있는지 먼저 확인

2. 서비스 실행
- `docker compose up -d db web`
- 접속: `http://localhost:3000`
- 헬스체크: `http://localhost:3000/up`

3. 핵심 구조 빠른 파악
- 라우트: `config/routes.rb`
- 크롤링 잡: `app/jobs/crawl_deals_job.rb`
- 크롤러 공통/구현: `app/services/crawlers/base_crawler.rb`, `app/services/crawlers/*_crawler.rb`
- 인증: `app/models/user.rb`, `config/initializers/devise.rb`
- 관리자 권한: `app/controllers/admin/base_controller.rb`

4. 테스트 검증
- `docker compose exec -T web bin/rails db:environment:set RAILS_ENV=test`
- `docker compose exec -T web bin/rails test`

5. 현재 운영/개발 포인트
- 개발 환경에서 `crawl_deals`는 5분 주기 실행 (`config/recurring.yml`)
- OAuth 활성 공급자: Google, Naver
- 테스트 호환성으로 `minitest`는 `~> 5.25` 고정 (`Gemfile`)

6. 종료
- `docker compose down`

## 주의사항

- 로컬 호스트 Ruby/Node 버전이 프로젝트 요구와 다를 수 있으므로 Docker 기준 작업을 권장합니다.
- 관리자 페이지 테스트/접근은 로그인된 admin 유저 전제가 필요합니다.
