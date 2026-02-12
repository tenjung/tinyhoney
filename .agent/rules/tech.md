---
trigger: always_on
---

1. 🛠️ 기술 스택 (Tech Stack)
App Server: Ruby on Rails 8 (Solid Queue/Solid Cache 내장 활용)

Database: PostgreSQL (핫딜 데이터, 사용자 가계부, 가격 히스토리 저장)

Background Worker: Sidekiq 또는 Rails 8 Solid Queue (뽐뿌, 루리웹 등 실시간 크롤링 전담)

Storage: AWS S3 (상품 이미지 캐싱 및 카드뉴스 저장)

Deployment: Kamal (VPS에 Docker 컨테이너로 배포)