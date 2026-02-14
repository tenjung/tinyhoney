# frozen_string_literal: true

# 🌱 TGMOA Seed Data — 다양한 카테고리의 현실적인 핫딜 더미 데이터

puts "🧹 기존 데이터 초기화..."
Event.destroy_all
PriceHistory.destroy_all
Deal.destroy_all

puts "🌱 핫딜 데이터 생성 중..."

# ── 카테고리별 Unsplash 실제 이미지 URLs ──
IMAGES = {
  fashion: [
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop"
  ],
  food: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=400&fit=crop"
  ],
  digital: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop"
  ],
  appliance: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop"
  ],
  game: [
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop"
  ],
  living: [
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"
  ],
  beauty: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop"
  ],
  sports: [
    "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop"
  ],
  kids: [
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop"
  ],
  pet: [
    "https://images.unsplash.com/photo-1583337130417-13104dec14a7?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop"
  ]
}.freeze

SOURCES = %w[PPOMPPU RULIWEB QUASARZONE AMISAE CLIEN ARCALIVE].freeze

deals_data = [
  # ── 의류 ──
  { title: "세미오버핏 폴리 반집업 맨투맨 (4컬러)", category: "의류", shop_name: "컨셉원",
    price: 22_000, shipping_fee: 0, source: "PPOMPPU", is_lowest: false, img_key: :fashion, img_idx: 0 },
  { title: "나이키 에어맥스 97 OG 실버불릿 DM0028-002", category: "의류", shop_name: "나이키코리아",
    price: 119_000, shipping_fee: 3_000, source: "ARCALIVE", is_lowest: false, img_key: :fashion, img_idx: 1 },
  { title: "무탠다드 워시드 포플린 셔츠 1.8발 (화이트/블루)", category: "의류", shop_name: "무신사",
    price: 15_900, shipping_fee: 0, source: "AMISAE", is_lowest: false, img_key: :fashion, img_idx: 2 },
  { title: "[리바이스] 501 오리지널 스트레이트 데님 진 (빈티지워싱)", category: "의류", shop_name: "하프클럽",
    price: 49_900, shipping_fee: 0, source: "CLIEN", is_lowest: true, img_key: :fashion, img_idx: 3 },
  { title: "유니클로 히트텍 크루넥 T 긴팔 (남/여)", category: "의류", shop_name: "유니클로",
    price: 9_900, shipping_fee: 0, source: "PPOMPPU", is_lowest: false, img_key: :fashion, img_idx: 4 },
  { title: "아디다스 삼바 OG 클래식 스니커즈 (블랙/화이트)", category: "의류", shop_name: "아디다스",
    price: 129_000, shipping_fee: 0, source: "RULIWEB", is_lowest: true, img_key: :fashion, img_idx: 5 },

  # ── 식품 ──
  { title: "앤업카페 돌체라떼 300ml 10개입 대용량팩", category: "식품", shop_name: "토스",
    price: 12_000, shipping_fee: 0, source: "PPOMPPU", is_lowest: true, img_key: :food, img_idx: 0 },
  { title: "곰곰 1+등급 한우 국거리 300g (냉장)", category: "식품", shop_name: "쿠팡",
    price: 9_900, shipping_fee: 0, source: "PPOMPPU", is_lowest: false, img_key: :food, img_idx: 1 },
  { title: "스타벅스 아메리카노 T 10잔 교환권", category: "식품", shop_name: "카카오톡선물하기",
    price: 33_000, shipping_fee: 0, source: "PPOMPPU", is_lowest: false, img_key: :food, img_idx: 2 },
  { title: "오뚜기 진라면 매운맛 120g × 40봉 박스", category: "식품", shop_name: "이마트몰",
    price: 18_900, shipping_fee: 0, source: "QUASARZONE", is_lowest: true, img_key: :food, img_idx: 3 },
  { title: "[코스트코] 커클랜드 시그니처 프로틴바 20개입", category: "식품", shop_name: "코스트코",
    price: 24_800, shipping_fee: 0, source: "CLIEN", is_lowest: false, img_key: :food, img_idx: 4 },

  # ── 디지털 ──
  { title: "로지텍 G502 X PLUS 무선 게이밍 마우스", category: "디지털", shop_name: "쿠팡",
    price: 89_000, shipping_fee: 0, source: "CLIEN", is_lowest: true, img_key: :digital, img_idx: 0 },
  { title: "삼성 갤럭시 버즈3 프로 SM-R630 정품", category: "디지털", shop_name: "SSG닷컴",
    price: 179_000, shipping_fee: 0, source: "RULIWEB", is_lowest: true, img_key: :digital, img_idx: 1 },
  { title: "애플 에어팟 프로 2세대 USB-C MQD83KH/A", category: "디지털", shop_name: "Apple Store",
    price: 259_000, shipping_fee: 0, source: "RULIWEB", is_lowest: false, img_key: :digital, img_idx: 2 },
  { title: "소니 WH-1000XM5 무선 노이즈캔슬링 헤드폰 (블랙)", category: "디지털", shop_name: "11번가",
    price: 289_000, shipping_fee: 0, source: "QUASARZONE", is_lowest: true, img_key: :digital, img_idx: 3 },
  { title: "앱코 HACKER K660 ARC 프리미엄 기계식 키보드", category: "디지털", shop_name: "다나와",
    price: 59_900, shipping_fee: 2_500, source: "QUASARZONE", is_lowest: false, img_key: :digital, img_idx: 4 },
  { title: "아이폰 15 Pro Max 256GB 자급제 (내추럴 티타늄)", category: "디지털", shop_name: "쿠팡",
    price: 1_550_000, shipping_fee: 0, source: "PPOMPPU", is_lowest: false, img_key: :digital, img_idx: 5 },

  # ── 가전 ──
  { title: "다이슨 V15 디텍트 앱솔루트 무선청소기", category: "가전", shop_name: "다이슨공식몰",
    price: 699_000, shipping_fee: 0, source: "CLIEN", is_lowest: true, img_key: :appliance, img_idx: 0 },
  { title: "LG 퓨리케어 360° 공기청정기 AS181DAW", category: "가전", shop_name: "LG전자",
    price: 389_000, shipping_fee: 0, source: "PPOMPPU", is_lowest: false, img_key: :appliance, img_idx: 1 },
  { title: "삼성 비스포크 냉장고 RF85B9111AP (870L)", category: "가전", shop_name: "삼성닷컴",
    price: 2_190_000, shipping_fee: 0, source: "QUASARZONE", is_lowest: false, img_key: :appliance, img_idx: 2 },
  { title: "발뮤다 더 토스터 K11A (화이트/블랙)", category: "가전", shop_name: "네이버쇼핑",
    price: 259_000, shipping_fee: 0, source: "AMISAE", is_lowest: true, img_key: :appliance, img_idx: 3 },

  # ── 게임 ──
  { title: "[스팀] 스팀 설날 할인 역대 최저가 게임 모음", category: "게임", shop_name: "스팀",
    price: 100, shipping_fee: 0, source: "QUASARZONE", is_lowest: true, img_key: :game, img_idx: 0 },
  { title: "닌텐도 스위치 OLED 젤다 에디션 + 틸즈오브더킹덤", category: "게임", shop_name: "쿠팡",
    price: 419_000, shipping_fee: 0, source: "RULIWEB", is_lowest: false, img_key: :game, img_idx: 1 },
  { title: "PS5 슬림 디스크 에디션 + 듀얼센스 추가 번들", category: "게임", shop_name: "11번가",
    price: 559_000, shipping_fee: 0, source: "ARCALIVE", is_lowest: false, img_key: :game, img_idx: 2 },

  # ── 생활용품/가구 ──
  { title: "이케아 KALLAX 칼락스 선반유닛 4×2 화이트", category: "가구", shop_name: "이케아",
    price: 99_900, shipping_fee: 5_000, source: "AMISAE", is_lowest: false, img_key: :living, img_idx: 0 },
  { title: "수저/젓가락/포크/나이프/디저트 등 풀세트", category: "생활용품", shop_name: "11번가",
    price: 3_900, shipping_fee: 0, source: "PPOMPPU", is_lowest: false, img_key: :living, img_idx: 1 },
  { title: "시디즈 T50 에어 메쉬 사무용 의자 (블랙)", category: "가구", shop_name: "시디즈 공식몰",
    price: 349_000, shipping_fee: 0, source: "CLIEN", is_lowest: true, img_key: :living, img_idx: 2 },

  # ── 뷰티 ──
  { title: "에스티로더 갈색병 어드밴스드 나이트 리페어 50ml", category: "뷰티", shop_name: "올리브영",
    price: 89_000, shipping_fee: 0, source: "AMISAE", is_lowest: false, img_key: :beauty, img_idx: 0 },
  { title: "헤라 블랙쿠션 SPF34 리필 포함 세트", category: "뷰티", shop_name: "네이버쇼핑",
    price: 35_000, shipping_fee: 0, source: "PPOMPPU", is_lowest: true, img_key: :beauty, img_idx: 1 },
  { title: "SK-II 페이셜 트리트먼트 에센스 230ml (피테라)", category: "뷰티", shop_name: "롯데온",
    price: 159_000, shipping_fee: 0, source: "ARCALIVE", is_lowest: false, img_key: :beauty, img_idx: 2 },

  # ── 스포츠 ──
  { title: "나이키 프리런 5.0 남성 러닝화 (블랙/볼트)", category: "스포츠", shop_name: "나이키코리아",
    price: 89_000, shipping_fee: 0, source: "RULIWEB", is_lowest: false, img_key: :sports, img_idx: 0 },
  { title: "룰루레몬 얼라인 레깅스 25인치 (블랙)", category: "스포츠", shop_name: "룰루레몬",
    price: 128_000, shipping_fee: 0, source: "AMISAE", is_lowest: true, img_key: :sports, img_idx: 1 },
  { title: "가민 포러너 265 GPS 스마트워치", category: "스포츠", shop_name: "쿠팡",
    price: 449_000, shipping_fee: 0, source: "CLIEN", is_lowest: false, img_key: :sports, img_idx: 2 },

  # ── 키즈 ──
  { title: "레고 테크닉 부가티 시론 42083 (3,599피스)", category: "키즈", shop_name: "레고코리아",
    price: 389_000, shipping_fee: 0, source: "RULIWEB", is_lowest: false, img_key: :kids, img_idx: 0 },
  { title: "뽀로로 코딩 컴퓨터 V2 유아 학습 완구", category: "키즈", shop_name: "토이저러스",
    price: 49_900, shipping_fee: 3_000, source: "PPOMPPU", is_lowest: true, img_key: :kids, img_idx: 1 },

  # ── 반려동물 ──
  { title: "로얄캐닌 미니 인도어 어덜트 4kg (소형견)", category: "반려동물", shop_name: "펫프렌즈",
    price: 35_900, shipping_fee: 0, source: "CLIEN", is_lowest: false, img_key: :pet, img_idx: 0 },
  { title: "캐츠랑 올라이프 고양이 사료 8kg", category: "반려동물", shop_name: "쿠팡",
    price: 22_900, shipping_fee: 0, source: "PPOMPPU", is_lowest: true, img_key: :pet, img_idx: 1 },

  # ── 기타 ──
  { title: "[기타] LG+U 알뜰 매달 3만원 상품권 쌀먹 혜택 (18330/무료)", category: "통신", shop_name: "LG유플러스",
    price: 18_330, shipping_fee: 0, source: "QUASARZONE", is_lowest: false, img_key: :digital, img_idx: 5 }
]

# ── 시간 분포 (자연스럽게) ──
time_offsets = deals_data.each_with_index.map { |_, i| (i * 3 + rand(0..5)).minutes }

deals_data.each_with_index do |data, idx|
  img = IMAGES[data[:img_key]][data[:img_idx]] rescue IMAGES[:digital].first

  deal = Deal.create!(
    title:         data[:title],
    url:           "https://example.com/deal/#{idx + 1}",
    source:        data[:source],
    category:      data[:category],
    shop_name:     data[:shop_name],
    price:         data[:price],
    shipping_fee:  data[:shipping_fee],
    is_lowest:     data[:is_lowest],
    thumbnail_url: img,
    description:   "#{data[:title]} — #{data[:shop_name]}에서 최저가로 만나보세요.",
    posted_at:     time_offsets[idx].ago,
  )

  # 가격 히스토리 (30% 확률로 이전 가격 기록 생성)
  if rand < 0.3
    higher = (data[:price] * rand(1.15..1.45)).round(-2)  # 15~45% 더 비쌌던 가격
    deal.price_histories.create!(recorded_price: higher, created_at: 7.days.ago)
    deal.price_histories.create!(recorded_price: (higher * rand(0.95..1.05)).round(-2), created_at: 3.days.ago)
    deal.price_histories.create!(recorded_price: data[:price], created_at: Time.current)
  end
end

puts "✅ #{Deal.count}개 핫딜 생성 완료!"
puts "   📊 카테고리: #{Deal.distinct.pluck(:category).join(', ')}"
puts "   🏪 쇼핑몰: #{Deal.distinct.pluck(:shop_name).compact.count}개"
puts "   🐝 허니픽(최저가): #{Deal.where(is_lowest: true).count}개"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🎁 이벤트 데이터
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

puts "\n🎁 이벤트 데이터 생성 중..."

EVENT_IMAGES = [
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop", # 선물박스
  "https://images.unsplash.com/photo-1464983308776-8f2b0b6a4f9f?w=800&h=600&fit=crop", # 파티
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop", # 쇼핑백
  "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=600&fit=crop", # 선물
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=600&fit=crop", # 이벤트
  "https://images.unsplash.com/photo-1511268559489-34b624fbfcf5?w=800&h=600&fit=crop", # 축하
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop", # 가전
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop" # 헤드폰
].freeze

events_data = [
  {
    title: "🎉 SK텔레콤 5G 가입 이벤트 - 갤럭시 버즈3 프로 증정",
    organizer: "SK telecom",
    platform_type: "통신사",
    start_date: Date.today - 1.day,
    end_date: Date.today + 7.days,
    entry_type: "작문/댓글",
    announcement_date: Date.today + 14.days,
    winner_count: 90,
    prize_tags: [ "네이버페이", "네이버페이 5천원" ].to_json,
    description: "🎊 댓글 EVENT 🎊\n\n모두의 손해 🤝\nT 멤버십 혜택을 한 곳에 꽉 담았다고 🔥\n\n'혜택을.. 노래로 만든다고? 🎵' 를 시청하고,\n내가 자주 이용하는 T 멤버십 혜택 중 노래 가사로 담기면 하는 브랜드를 댓글로 남겨주세요!\n\n추첨을 통해 선물을 드립니다! 😍\n\n📍 이벤트 참여 방법\n✔️ SK텔레콤 유튜브 채널 구독하기\n✔️ 본 영상 좋아요 누르기\n✔️ [혜택을.. 노래로 만든다고?🎵] 시청 후,\n'노래 가사로 담기면 하는 브랜드' 댓글 남기기\n\n📍 이벤트 기간\n2/13(금) ~ 2/20(금)\n\n📍 경품\n(90명) 네이버페이 5천원",
    url: "https://example.com/event/sk-telecom",
    thumbnail_url: EVENT_IMAGES[0],
    is_manual: false,
    share_count: 42,
    bookmark_count: 128
  },
  {
    title: "🎁 LG전자 설 맞이 가전 구매 이벤트",
    organizer: "LG전자",
    platform_type: "가전",
    start_date: Date.today - 5.days,
    end_date: Date.today + 10.days,
    entry_type: "선착순",
    announcement_date: Date.today + 12.days,
    winner_count: 500,
    prize_tags: [ "LG 스타일러", "LG 건조기", "네이버페이 10만원" ].to_json,
    description: "LG전자 설 맞이 대축제! 🎊\n\n가전제품 구매 시 푸짐한 경품을 드립니다.\n\n✨ 1등: LG 스타일러 (5명)\n✨ 2등: LG 건조기 (10명)\n✨ 3등: 네이버페이 10만원 (485명)\n\n※ 참여방법\n1. LG전자 공식몰 회원가입\n2. 이벤트 기간 내 50만원 이상 구매\n3. 자동 응모 완료",
    url: "https://example.com/event/lg-electronics",
    thumbnail_url: EVENT_IMAGES[6],
    is_manual: false,
    share_count: 215,
    bookmark_count: 567
  },
  {
    title: "🎮 플레이스테이션 스토어 설 특가 이벤트",
    organizer: "Sony PlayStation",
    platform_type: "게임",
    start_date: Date.today - 3.days,
    end_date: Date.today + 4.days,
    entry_type: "구매",
    announcement_date: Date.today + 8.days,
    winner_count: 100,
    prize_tags: [ "PS5 디지털 에디션", "듀얼센스 컨트롤러", "PSN 기프트카드" ].to_json,
    description: "PlayStation 설 특가 세일! 🎮\n\n최대 80% 할인된 가격으로 인기 게임을 만나보세요.\n\n🎁 이벤트 경품\n- 1등: PS5 디지털 에디션 (10명)\n- 2등: 듀얼센스 컨트롤러 (30명)\n- 3등: PSN 기프트카드 5만원 (60명)\n\n응모 방법: 이벤트 기간 중 게임 1개 이상 구매",
    url: "https://example.com/event/playstation",
    thumbnail_url: EVENT_IMAGES[1],
    is_manual: false,
    share_count: 892,
    bookmark_count: 1453
  },
  {
    title: "☕ 스타벅스 봄맞이 e-프리퀀시 2배 적립",
    organizer: "Starbucks Korea",
    platform_type: "식품",
    start_date: Date.today,
    end_date: Date.today + 14.days,
    entry_type: "자동참여",
    announcement_date: Date.today + 15.days,
    winner_count: 1000,
    prize_tags: [ "아메리카노 쿠폰", "텀블러", "스타벅스 카드" ].to_json,
    description: "🌸 봄맞이 e-프리퀀시 2배 적립 이벤트!\n\n기간 내 음료 구매 시 별 2개 적립\n\n🎁 추첨 경품\n- 1등: 스타벅스 카드 10만원 (100명)\n- 2등: 스타벅스 텀블러 (300명)\n- 3등: 아메리카노 쿠폰 (600명)\n\n※ 스타벅스 리워드 회원 자동 참여",
    url: "https://example.com/event/starbucks",
    thumbnail_url: EVENT_IMAGES[2],
    is_manual: false,
    share_count: 1247,
    bookmark_count: 2891
  },
  {
    title: "👟 나이키 멤버십 신규 가입 이벤트",
    organizer: "Nike Korea",
    platform_type: "의류",
    start_date: Date.today - 2.days,
    end_date: Date.today + 20.days,
    entry_type: "가입",
    announcement_date: Date.today + 25.days,
    winner_count: 200,
    prize_tags: [ "나이키 에어맥스", "나이키 기프트카드", "운동복 세트" ].to_json,
    description: "🏃 나이키 멤버십 신규 가입 이벤트\n\n지금 가입하고 푸짐한 혜택을 받아가세요!\n\n🎁 경품\n- 1등: 나이키 에어맥스 (20명)\n- 2등: 나이키 기프트카드 10만원 (80명)\n- 3등: 운동복 세트 (100명)\n\n+ 신규 가입 즉시 15% 할인 쿠폰 증정",
    url: "https://example.com/event/nike",
    thumbnail_url: EVENT_IMAGES[3],
    is_manual: false,
    share_count: 534,
    bookmark_count: 1092
  },
  {
    title: "🎧 애플 에어팟 프로 2세대 체험단 모집",
    organizer: "Apple Korea",
    platform_type: "디지털",
    start_date: Date.today - 1.day,
    end_date: Date.today + 5.days,
    entry_type: "작문/댓글",
    announcement_date: Date.today + 7.days,
    winner_count: 50,
    prize_tags: [ "에어팟 프로 2세대", "애플 기프트카드" ].to_json,
    description: "🎧 에어팟 프로 2세대 체험단 모집!\n\n새로워진 H2 칩과 적응형 오디오를 직접 경험해보세요.\n\n📝 참여 방법\n1. 애플 코리아 인스타그램 팔로우\n2. 게시물 좋아요 + 댓글 남기기\n3. 스토리 공유하기\n\n🎁 선정 혜택\n- 에어팟 프로 2세대 (50명, 체험 후 증정)\n- 리뷰 작성 시 애플 기프트카드 5만원 추가 증정",
    url: "https://example.com/event/apple-airpods",
    thumbnail_url: EVENT_IMAGES[7],
    is_manual: false,
    share_count: 1823,
    bookmark_count: 3421
  },
  {
    title: "🏠 이케아 봄맞이 인테리어 이벤트",
    organizer: "IKEA Korea",
    platform_type: "가구",
    start_date: Date.today - 7.days,
    end_date: Date.today + 23.days,
    entry_type: "구매",
    announcement_date: Date.today + 30.days,
    winner_count: 300,
    prize_tags: [ "이케아 가구", "이케아 기프트카드", "쿠션/러그 세트" ].to_json,
    description: "🌸 이케아 봄맞이 인테리어 이벤트\n\n봄을 맞아 집을 새롭게 꾸며보세요!\n\n🎁 경품\n- 1등: 이케아 가구 세트 100만원 상당 (10명)\n- 2등: 이케아 기프트카드 30만원 (90명)\n- 3등: 쿠션/러그 세트 (200명)\n\n※ 30만원 이상 구매 시 자동 응모",
    url: "https://example.com/event/ikea",
    thumbnail_url: EVENT_IMAGES[4],
    is_manual: false,
    share_count: 678,
    bookmark_count: 1234
  },
  {
    title: "💄 올리브영 뷰티 페스티벌 2026",
    organizer: "Olive Young",
    platform_type: "뷰티",
    start_date: Date.today,
    end_date: Date.today + 30.days,
    entry_type: "선착순",
    announcement_date: Date.today + 32.days,
    winner_count: 2000,
    prize_tags: [ "뷰티 럭키박스", "올리브영 기프트카드", "인기 화장품 세트" ].to_json,
    description: "💄 올리브영 뷰티 페스티벌 2026\n\n최대 50% 할인 + 푸짐한 사은품!\n\n🎁 이벤트 경품 (매일 추첨)\n- 뷰티 럭키박스 (1,000명)\n- 올리브영 기프트카드 5만원 (500명)\n- 인기 화장품 세트 (500명)\n\n※ 매일 1만원 이상 구매 시 1회 응모 가능",
    url: "https://example.com/event/oliveyoung",
    thumbnail_url: EVENT_IMAGES[5],
    is_manual: false,
    share_count: 2341,
    bookmark_count: 4892
  }
].freeze

events_data.each_with_index do |data, idx|
  Event.create!(
    title: data[:title],
    organizer: data[:organizer],
    platform_type: data[:platform_type],
    start_date: data[:start_date],
    end_date: data[:end_date],
    entry_type: data[:entry_type],
    announcement_date: data[:announcement_date],
    winner_count: data[:winner_count],
    prize_tags: data[:prize_tags],
    description: data[:description],
    url: data[:url],
    thumbnail_url: data[:thumbnail_url],
    is_manual: data[:is_manual],
    share_count: data[:share_count],
    bookmark_count: data[:bookmark_count],
    created_at: (idx * 2).hours.ago
  )
end

puts "✅ #{Event.count}개 이벤트 생성 완료!"
puts "   🎁 주최사: #{Event.distinct.pluck(:organizer).join(', ')}"
puts "   📅 진행중: #{Event.where('end_date >= ?', Date.today).count}개"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 게시판 데이터
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

puts "📋 게시판 데이터 생성 중..."

boards_data = [
  {
    name: "품앗이",
    slug: "exchange",
    description: "서로 도움을 주고받는 따뜻한 공간입니다",
    icon: "🤝"
  },
  {
    name: "장터",
    slug: "market",
    description: "중고 거래와 공동구매를 진행하는 장터입니다",
    icon: "🛒"
  },
  {
    name: "당첨자랑",
    slug: "winners",
    description: "이벤트 당첨 소식을 자랑하고 축하해주세요",
    icon: "🎉"
  },
  {
    name: "익명게시판",
    slug: "anonymous",
    description: "익명으로 자유롭게 이야기를 나누는 공간입니다",
    icon: "🎭"
  },
  {
    name: "미니게임",
    slug: "minigame",
    description: "재미있는 미니게임으로 포인트를 획득하세요",
    icon: "🎮"
  }
]

boards_data.each do |data|
  Board.create!(
    name: data[:name],
    slug: data[:slug],
    description: data[:description]
  )
end

puts "✅ #{Board.count}개 게시판 생성 완료!"
puts "   📋 게시판: #{Board.pluck(:name).join(', ')}"
