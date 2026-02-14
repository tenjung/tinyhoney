# frozen_string_literal: true

# 🌱 TGMOA Seed Data — 다양한 카테고리의 현실적인 핫딜 & 커뮤니티 더미 데이터

puts "🧹 기존 데이터 초기화..."
Comment.destroy_all
Post.destroy_all
Board.destroy_all
Event.destroy_all
PriceHistory.destroy_all
Deal.destroy_all
User.destroy_all

puts "🌱 핫딜 데이터 생성 중..."
deals_data = [
  {
    title: "LG전자 울트라기어 27GP850 게이밍 모니터 QHD 180Hz",
    price: 399000,
    url: "https://www.lge.co.kr",
    mall_name: "LGE.COM",
    category: "디지털",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "[쿠팡] Apple 아이폰 15 Pro 자급제 256GB 블루 티타늄",
    price: 1350000,
    url: "https://www.coupang.com",
    mall_name: "쿠팡",
    category: "디지털",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "삼성전자 비스포크 제트 봇 AI 로봇청소기 VR50D95936W",
    price: 890000,
    url: "https://www.samsung.com",
    mall_name: "삼성닷컴",
    category: "가전",
    shipping_fee: 0,
    is_lowest: false
  },
  {
    title: "나이키 덩크 로우 레트로 블랙/화이트 (범고래)",
    price: 129000,
    url: "https://www.nike.com",
    mall_name: "나이키 공홈",
    category: "의류",
    shipping_fee: 3000,
    is_lowest: false
  },
  {
    title: "신라면 120g x 40봉 (1박스) 무료배송",
    price: 24900,
    url: "https://brand.naver.com/nongshim",
    mall_name: "농심몰",
    category: "식품",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "스탠리 퀜처 H2.0 플로우스테이트 텀블러 1.18L",
    price: 49000,
    url: "https://www.stanley1913.com",
    mall_name: "스탠리",
    category: "생활용품",
    shipping_fee: 3000,
    is_lowest: false
  },
  {
    title: "닌텐도 스위치 OLED 모델 화이트 + 마리오 카트 8",
    price: 385000,
    url: "https://www.nintendo.co.kr",
    mall_name: "닌텐도 스토어",
    category: "게임",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "다이슨 에어랩 멀티 스타일러 컴플리트 롱",
    price: 599000,
    url: "https://www.dyson.co.kr",
    mall_name: "다이슨",
    category: "뷰티",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "햇반 210g x 36개 1박스",
    price: 28900,
    url: "https://www.cjthemarket.com",
    mall_name: "CJ더마켓",
    category: "식품",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "소니 WH-1000XM5 노이즈 캔슬링 헤드폰",
    price: 398000,
    url: "https://store.sony.co.kr",
    mall_name: "소니스토어",
    category: "디지털",
    shipping_fee: 0,
    is_lowest: false
  },
  {
    title: "맥북 프로 14인치 M3 Pro 스페이스 블랙",
    price: 2690000,
    url: "https://www.apple.com",
    mall_name: "Apple",
    category: "디지털",
    shipping_fee: 0,
    is_lowest: false
  },
  {
    title: "갤럭시 S24 울트라 티타늄 그레이 512GB",
    price: 1540000,
    url: "https://www.samsung.com",
    mall_name: "삼성닷컴",
    category: "디지털",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "이케아 MARKUS 마르쿠스 사무용 의자",
    price: 199000,
    url: "https://www.ikea.com",
    mall_name: "IKEA",
    category: "가구",
    shipping_fee: 59000,
    is_lowest: false
  },
  {
    title: "PS5 슬림 디스크 에디션 + 스파이더맨 2 번들",
    price: 648000,
    url: "https://www.playstation.com",
    mall_name: "PS Store",
    category: "게임",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "코카콜라 제로 355ml x 24캔",
    price: 16900,
    url: "https://brand.naver.com/coke",
    mall_name: "코카콜라 공식몰",
    category: "식품",
    shipping_fee: 3000,
    is_lowest: true
  },
  {
    title: "에어팟 프로 2세대 USB-C",
    price: 299000,
    url: "https://www.apple.com",
    mall_name: "쿠팡",
    category: "디지털",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "LG 그램 16인치 2024년형 울트라 슬림",
    price: 1450000,
    url: "https://www.lge.co.kr",
    mall_name: "LGE.COM",
    category: "디지털",
    shipping_fee: 0,
    is_lowest: false
  },
  {
    title: "스타벅스 카페 아메리카노 T 2잔 + 부드러운 생크림 카스텔라",
    price: 11500,
    url: "https://www.kakao.com",
    mall_name: "카카오톡 선물하기",
    category: "식품",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "아디다스 삼바 OG 화이트/블랙",
    price: 139000,
    url: "https://www.adidas.co.kr",
    mall_name: "아디다스",
    category: "의류",
    shipping_fee: 0,
    is_lowest: false
  },
  {
    title: "비비고 왕교자 1.05kg x 2봉",
    price: 17900,
    url: "https://www.cjthemarket.com",
    mall_name: "CJ더마켓",
    category: "식품",
    shipping_fee: 3000,
    is_lowest: true
  },
  {
    title: "삼성 오디세이 G9 OLED 게이밍 모니터",
    price: 1790000,
    url: "https://www.samsung.com",
    mall_name: "삼성닷컴",
    category: "디지털",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "로지텍 MX Master 3S 무선 마우스",
    price: 119000,
    url: "https://www.logitech.com",
    mall_name: "로지텍",
    category: "디지털",
    shipping_fee: 2500,
    is_lowest: false
  },
  {
    title: "하기스 네이처메이드 기저귀 3단계 밴드형",
    price: 45000,
    url: "https://www.momq.co.kr",
    mall_name: "맘큐",
    category: "키즈",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "설화수 자음 2종 세트",
    price: 89000,
    url: "https://www.amorepacific.com",
    mall_name: "아모레몰",
    category: "뷰티",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "아이패드 에어 5세대 64GB Wi-Fi",
    price: 749000,
    url: "https://www.apple.com",
    mall_name: "쿠팡",
    category: "디지털",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "나이키 스포츠웨어 클럽 플리스 후디",
    price: 69000,
    url: "https://www.nike.com",
    mall_name: "나이키",
    category: "의류",
    shipping_fee: 3000,
    is_lowest: false
  },
  {
    title: "테팔 매직핸즈 인덕션 프라이팬 세트",
    price: 89900,
    url: "https://brand.naver.com/tefal",
    mall_name: "테팔",
    category: "생활용품",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "일리 Y3.3 캡슐커피머신 + 캡슐 14개",
    price: 119000,
    url: "https://shop.illy.com",
    mall_name: "일리",
    category: "가전",
    shipping_fee: 0,
    is_lowest: false
  },
  {
    title: "구글 기프트카드 5만원권 (코드발송)",
    price: 46500,
    url: "https://www.tmon.co.kr",
    mall_name: "티몬",
    category: "디지털",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "SKT 5GX 요금제 가입 이벤트",
    price: 0,
    url: "https://www.tworld.co.kr",
    mall_name: "T월드",
    category: "통신",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "로컬스티치 멤버십 1개월 이용권",
    price: 99000,
    url: "https://localstitch.co.kr",
    mall_name: "로컬스티치",
    category: "생활용품",
    shipping_fee: 0,
    is_lowest: false
  },
  {
    title: "요넥스 배드민턴 라켓 나노플레어 700",
    price: 189000,
    url: "https://www.yonex.co.kr",
    mall_name: "요넥스",
    category: "스포츠",
    shipping_fee: 3000,
    is_lowest: false
  },
  {
    title: "로얄캐닌 인도어 어덜트 고양이 사료 10kg",
    price: 89000,
    url: "https://www.royalcanin.com",
    mall_name: "펫프렌즈",
    category: "반려동물",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "발뮤다 더 토스터 K05B",
    price: 249000,
    url: "https://www.balmuda.co.kr",
    mall_name: "발뮤다",
    category: "가전",
    shipping_fee: 0,
    is_lowest: false
  },
  {
    title: "시디즈 T50 AIR 매쉬 의자",
    price: 349000,
    url: "https://www.sidiz.com",
    mall_name: "시디즈",
    category: "가구",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "LG 스탠바이미 27인치 이동식 TV",
    price: 980000,
    url: "https://www.lge.co.kr",
    mall_name: "LGE.COM",
    category: "가전",
    shipping_fee: 0,
    is_lowest: false
  },
  {
    title: "애플워치 SE 2세대 40mm GPS",
    price: 299000,
    url: "https://www.apple.com",
    mall_name: "쿠팡",
    category: "디지털",
    shipping_fee: 0,
    is_lowest: true
  },
  {
    title: "스팸 클래식 340g x 10개",
    price: 32900,
    url: "https://www.cjthemarket.com",
    mall_name: "CJ더마켓",
    category: "식품",
    shipping_fee: 3000,
    is_lowest: true
  }
]

sources = [ "PPOMPPU", "RULIWEB", "QUASARZONE", "AMISAE", "CLIEN", "ARCALIVE" ]

deals_data.each_with_index do |data, idx|
  deal = Deal.create!(
    title: data[:title],
    price: data[:price],
    url: "#{data[:url]}?v=#{idx}",
    shop_name: data[:mall_name],
    category: data[:category],
    shipping_fee: data[:shipping_fee],
    source: sources.sample,
    posted_at: (idx * 30).minutes.ago,
    thumbnail_url: "https://picsum.photos/seed/#{idx}/200/200",
    is_lowest: data[:is_lowest],
    description: "#{data[:title]} 상세 설명입니다.\n\n가격: #{data[:price]}원\n몰: #{data[:mall_name]}\n\n지금 바로 확인해보세요!"
  )

  # 가격 변동 히스토리 생성 (약 30% 확률)
  if rand < 0.3
    base_price = data[:price]
    3.times do |i|
      PriceHistory.create!(
        deal: deal,
        recorded_price: base_price * (1.0 + (i + 1) * 0.1), # 과거에는 더 비쌌음
        created_at: (i + 1).days.ago
      )
    end
  end
end

puts "✅ #{Deal.count}개 핫딜 생성 완료!"
puts "   📊 카테고리: #{Deal.distinct.pluck(:category).join(', ')}"
puts "   🏪 쇼핑몰: #{Deal.distinct.pluck(:shop_name).count}개"
puts "   🐝 허니픽(최저가): #{Deal.where(is_lowest: true).count}개"
puts ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 이벤트 데이터
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

puts "🎁 이벤트 데이터 생성 중..."

events_data = [
  {
    title: "🎉 SK텔레콤 5G 가입 이벤트 - 갤럭시 버즈3 프로 증정",
    organizer: "SK telecom",
    platform_type: "통신사",
    url: "https://www.sktelecom.com",
    thumbnail_url: "https://picsum.photos/seed/event1/800/400",
    description: "T월드에서 5G 요금제 신규 가입하고 갤럭시 버즈3 프로 받아가세요!\n\n참여 방법:\n1. T월드 로그인\n2. 이벤트 응모 버튼 클릭\n3. 5G 요금제 가입",
    start_date: Date.today - 2.days,
    end_date: Date.today + 7.days,
    entry_type: "작문/댓글",
    winner_count: 90,
    announcement_date: Date.today + 14.days,
    prize_tags: [ "네이버페이", "네이버페이 5천원" ],
    share_count: 5,
    bookmark_count: 12
  },
  {
    title: "🌸 올리브영 봄맞이 빅세일 & 럭키박스 증정",
    organizer: "Alive Young",
    platform_type: "뷰티",
    url: "https://www.oliveyoung.co.kr",
    thumbnail_url: "https://picsum.photos/seed/event2/800/400",
    description: "올영이 준비한 역대급 봄 세일!\n매일 선착순 1,000명에게 럭키박스를 드립니다.",
    start_date: Date.today,
    end_date: Date.today + 3.days,
    entry_type: "선착순",
    winner_count: 3000,
    announcement_date: Date.today + 4.days,
    prize_tags: [ "상품권", "미용소품" ],
    share_count: 120,
    bookmark_count: 340
  },
  {
    title: "🎮 플레이스테이션 5 프로 출시 기념 기대평 이벤트",
    organizer: "Sony PlayStation",
    platform_type: "게임",
    url: "https://www.playstation.com",
    thumbnail_url: "https://picsum.photos/seed/event3/800/400",
    description: "PS5 Pro 출시 기념!\n기대평을 남겨주시면 추첨을 통해 PS5 Pro를 드립니다.",
    start_date: Date.today - 5.days,
    end_date: Date.today + 10.days,
    entry_type: "작문/댓글",
    winner_count: 1,
    announcement_date: Date.today + 20.days,
    prize_tags: [ "PS5 Pro", "듀얼센스" ],
    share_count: 450,
    bookmark_count: 890
  },
  {
    title: "🍱 CJ더마켓 햇반 정기배송 신청 시 첫 달 100원",
    organizer: "CJ CheilJedang",
    platform_type: "식품",
    url: "https://www.cjthemarket.com",
    thumbnail_url: "https://picsum.photos/seed/event4/800/400",
    description: "밥 하지 마세요!\n햇반 정기배송 신청하면 첫 달 100원에 드립니다.",
    start_date: Date.today - 10.days,
    end_date: Date.today - 1.days, # 마감된 이벤트
    entry_type: "구매",
    winner_count: 0,
    announcement_date: nil,
    prize_tags: [ "할인쿠폰" ],
    share_count: 30,
    bookmark_count: 45
  },
  {
    title: "💻 LG 그램 대학생 서포터즈 모집",
    organizer: "LG전자",
    platform_type: "가전",
    url: "https://www.lge.co.kr",
    thumbnail_url: "https://picsum.photos/seed/event5/800/400",
    description: "LG 그램과 함께할 대학생 서포터즈를 모집합니다.\n활동비 지급 및 최우수 활동자 그램 증정!",
    start_date: Date.today - 1.days,
    end_date: Date.today + 14.days,
    entry_type: "가입",
    winner_count: 20,
    announcement_date: Date.today + 20.days,
    prize_tags: [ "노트북", "활동비" ],
    share_count: 80,
    bookmark_count: 150
  },
  {
    title: "☕ 스타벅스 사이렌 오더 1억건 돌파 기념 별 증정",
    organizer: "Starbucks Korea",
    platform_type: "식품",
    url: "https://www.starbucks.co.kr",
    thumbnail_url: "https://picsum.photos/seed/event6/800/400",
    description: "사이렌 오더 주문 시 별 3개 추가 적립!\n매일매일 참여 가능합니다.",
    start_date: Date.today,
    end_date: Date.today + 30.days,
    entry_type: "구매",
    winner_count: 0,
    announcement_date: nil,
    prize_tags: [ "별", "쿠폰" ],
    share_count: 200,
    bookmark_count: 300
  },
  {
    title: "👟 나이키 런 클럽 챌린지 - 100km 달리기",
    organizer: "Nike Korea",
    platform_type: "의류",
    url: "https://www.nike.com",
    thumbnail_url: "https://picsum.photos/seed/event7/800/400",
    description: "이번 달 100km 달리기 성공하고\n한정판 러닝화 래플 응모하세요!",
    start_date: Date.today - 15.days,
    end_date: Date.today + 15.days,
    entry_type: "자동참여",
    winner_count: 50,
    announcement_date: Date.today + 20.days,
    prize_tags: [ "러닝화", "티셔츠" ],
    share_count: 60,
    bookmark_count: 90
  },
  {
    title: "📱 아이폰 15 옐로우 출시 기념 퀴즈 이벤트",
    organizer: "Apple Korea",
    platform_type: "디지털",
    url: "https://www.apple.com",
    thumbnail_url: "https://picsum.photos/seed/event8/800/400",
    description: "새로운 아이폰 색상은 무엇일까요?\n정답을 맞히면 추첨을 통해 아이폰 케이스를 드립니다.",
    start_date: Date.today,
    end_date: Date.today + 5.days,
    entry_type: "작문/댓글",
    winner_count: 100,
    announcement_date: Date.today + 10.days,
    prize_tags: [ "케이스", "그립톡" ],
    share_count: 150,
    bookmark_count: 200
  }
]

events_data.each_with_index do |data, idx|
  Event.create!(
    title: data[:title],
    organizer: data[:organizer],
    platform_type: data[:platform_type],
    url: "#{data[:url]}?v=#{idx}",
    thumbnail_url: data[:thumbnail_url],
    description: data[:description],
    start_date: data[:start_date],
    end_date: data[:end_date],
    entry_type: data[:entry_type],
    winner_count: data[:winner_count],
    announcement_date: data[:announcement_date],
    prize_tags: data[:prize_tags],
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

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 게시글 & 댓글 더미 데이터
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

puts "📝 게시글 & 댓글 데이터 생성 중..."

# 더미 사용자 생성 (게시글 작성용)
dummy_users = []
5.times do |i|
  dummy_users << User.create!(
    email: "user#{i+1}@example.com",
    password: "password123",
    password_confirmation: "password123"
  )
end

# 게시판별 게시글 데이터
posts_data = {
  "exchange" => [
    { title: "🎁 에어팟 프로 2세대 나눔합니다", content: "사용하지 않는 에어팟 프로 2세대 나눔합니다.\n선착순 1명, 댓글로 신청해주세요!\n\n조건:\n- 활동 30일 이상\n- 성실한 후기 작성 필수" },
    { title: "🤝 스타벅스 쿠폰 교환하실 분", content: "아메리카노 쿠폰 5장 있는데 라떼 쿠폰으로 교환하실 분 계신가요?" },
    { title: "💝 중고나라 계정 빌려주실 분", content: "급하게 물건 팔아야 하는데 계정이 정지되었습니다 ㅠㅠ\n잠깐만 빌려주실 수 있나요?" },
    { title: "🎮 닌텐도 스위치 게임 교환", content: "젤다의 전설 <-> 마리오 카트 교환하실 분 구합니다" },
    { title: "📚 IT 개발 서적 나눔", content: "읽지 않는 개발 서적 10권 정도 나눔합니다.\n직거래 가능하신 분만 댓글 주세요!" }
  ],
  "market" => [
    { title: "🖥️ 맥북 프로 M3 중고 판매", content: "맥북 프로 14인치 M3 모델 판매합니다.\n\n구매일: 2024.11\n상태: S급 (거의 새것)\n가격: 220만원 (네고 가능)\n직거래: 강남역\n\n관심 있으신 분 쪽지 주세요!" },
    { title: "🎧 소니 WH-1000XM5 헤드폰 팝니다", content: "소니 노이즈캔슬링 헤드폰 판매합니다.\n사용 기간 3개월, 박스/구성품 모두 있습니다.\n\n가격: 28만원\n택배비 별도" },
    { title: "📱 아이폰 15 Pro 자급제 판매", content: "아이폰 15 Pro 256GB 블루티타늄\n개통 후 미사용 (1주일)\n\n가격: 135만원\n직거래 선호 (서울 전지역)" },
    { title: "⌚ 애플워치 울트라 2 팝니다", content: "애플워치 울트라 2 판매합니다.\n사용감 거의 없고 스크래치 전혀 없습니다.\n\n가격: 85만원 (네고 X)" },
    { title: "🎮 PS5 디스크 에디션 판매", content: "플스5 디스크 에디션 + 듀얼센스 2개\n게임 5개 포함\n\n가격: 45만원\n직거래: 홍대입구역" }
  ],
  "winners" => [
    { title: "🎉 SK텔레콤 갤럭시 버즈 당첨!", content: "드디어 당첨되었습니다!!\n5G 가입 이벤트 응모했는데 버즈3 프로 당첨 ㅠㅠ\n\n응모 팁:\n- 매일 응모하기\n- SNS 공유 필수\n- 댓글 성실하게 작성" },
    { title: "🏆 스타벅스 1년 무료 당첨 후기", content: "믿을 수 없지만 스타벅스 1년 무료 이벤트 당첨되었습니다!\n매일 아메리카노 1잔씩 1년간 무료!\n\n진짜 포기하지 않고 매일 응모하면 당첨됩니다 ㅎㅎ" },
    { title: "💰 올리브영 10만원 상품권 당첨", content: "올리브영 럭키박스 이벤트 당첨!\n10만원 상품권 받았어요 🎁" },
    { title: "🎁 애플 에어팟 맥스 당첨 인증", content: "애플 스토어 이벤트 당첨!\n에어팟 맥스 받았습니다 ㅠㅠ\n\n사진 첨부합니다!" },
    { title: "🎊 LG전자 건조기 당첨 후기", content: "LG 트롬 건조기 당첨되었습니다!\n가격이 200만원이 넘는데... 믿기지 않네요\n\n응모 기간: 3개월\n응모 횟수: 매일" }
  ],
  "anonymous" => [
    { title: "💬 요즘 핫딜 너무 안 올라오는 것 같아요", content: "예전엔 매일 좋은 딜이 올라왔는데\n요즘은 별로인 것 같아요 ㅠㅠ\n\n다들 어떻게 생각하시나요?" },
    { title: "🤔 이벤트 당첨 확률 진짜 있나요?", content: "매일 응모하는데 한 번도 당첨된 적이 없어요...\n혹시 당첨 조작 아닐까요?" },
    { title: "😤 중고거래 사기 당했어요", content: "중고나라에서 맥북 사려다가 사기 당했습니다.\n입금하고 연락 두절...\n\n여러분 조심하세요 ㅠㅠ" },
    { title: "🎮 닌텐도 스위치 vs PS5 뭐가 나을까요?", content: "둘 다 사고 싶은데 예산이 부족해서...\n게임 좋아하시는 분들 추천 부탁드려요!" },
    { title: "💸 이번 달 핫딜로 얼마나 절약하셨나요?", content: "저는 약 30만원 정도 절약한 것 같아요!\n다들 자랑해주세요 ㅎㅎ" }
  ],
  "minigame" => [
    { title: "🎯 출석체크 이벤트 시작!", content: "매일 출석하면 포인트 적립!\n\n- 1일차: 10P\n- 7일차: 100P\n- 30일차: 1000P\n\n지금 바로 참여하세요!" },
    { title: "🎲 룰렛 돌리기 이벤트", content: "하루 3번 무료 룰렛!\n\n경품:\n- 1등: 스타벅스 1만원\n- 2등: 편의점 5천원\n- 3등: 포인트 100P" },
    { title: "🧩 퀴즈 맞히고 포인트 받기", content: "오늘의 퀴즈:\n\nQ. 티니허니의 마스코트는?\n1) 벌\n2) 곰\n3) 토끼\n\n댓글로 정답을 맞혀주세요!" },
    { title: "🎰 슬롯머신 이벤트", content: "777 맞히면 1만 포인트!\n\n참여 방법:\n1. 댓글로 '참여' 작성\n2. 자동으로 슬롯 돌아감\n3. 결과 확인!" },
    { title: "🏃 포인트 레이스 시작", content: "이번 주 포인트 1위:\n상금 10만원!\n\n현재 순위:\n1위: user123 (5,230P)\n2위: honey_bee (4,890P)\n3위: deal_hunter (4,120P)" }
  ]
}

# 게시글 생성
all_posts = []
Board.all.each do |board|
  posts = posts_data[board.slug] || []
  posts.each_with_index do |post_data, idx|
    post = Post.create!(
      board: board,
      user: dummy_users.sample,
      title: post_data[:title],
      content: post_data[:content],
      created_at: (posts.length - idx).hours.ago
    )
    all_posts << post
  end
end

puts "✅ #{Post.count}개 게시글 생성 완료!"

# 댓글 생성
puts "💬 댓글 데이터 생성 중..."

comment_templates = [
  "좋은 정보 감사합니다!",
  "저도 관심 있어요!",
  "혹시 아직 남아있나요?",
  "쪽지 보냈습니다!",
  "가격 네고 가능한가요?",
  "직거래 가능할까요?",
  "정보 감사합니다 ㅎㅎ",
  "저도 신청합니다!",
  "대박이네요 축하드려요!",
  "부럽습니다 ㅠㅠ",
  "저도 당첨되고 싶어요",
  "팁 감사합니다!",
  "유용한 정보네요",
  "공감합니다",
  "저도 같은 생각이에요"
]

all_posts.each do |post|
  # 각 게시글에 0~5개의 랜덤 댓글
  rand(0..5).times do
    Comment.create!(
      post: post,
      user: dummy_users.sample,
      content: comment_templates.sample,
      created_at: rand(1..24).hours.ago
    )
  end
end

puts "✅ #{Comment.count}개 댓글 생성 완료!"
puts "   📊 게시판별 게시글 수:"
Board.all.each do |board|
  puts "      #{board.name}: #{board.posts.count}개"
end
