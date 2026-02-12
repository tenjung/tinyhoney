module Crawlers
  class PpombbuCrawler < BaseCrawler
    BASE_URL = "https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu"

    def call
      doc = Nokogiri::HTML(URI.open(BASE_URL).read)
      
      # Ppombbu hot deal table rows
      # Note: This selector might need adjustment as Ppombbu structure can change
      doc.css("tr.list0, tr.list1").each do |row|
        title_element = row.css("td:nth-child(3) a font.list_title").first || row.css("td:nth-child(3) a").first
        next unless title_element

        title = title_element.text.strip
        link = row.css("td:nth-child(3) a").first["href"]
        url = URI.join(BASE_URL, link).to_s
        
        # Simple price extraction (often in [10,000원] format)
        price_match = title.match(/[\d,]+[원|₩|\$]/)
        price = price_match ? price_match[0].gsub(/[^\d]/, "").to_i : 0

        find_or_create_deal(
          title: title,
          url: url,
          source: "PPOMPPU",
          category: "GENERAL", # Could be refined
          price: price,
          posted_at: Time.current
        )
      end
    rescue => e
      Rails.logger.error "PpombbuCrawler Error: #{e.message}"
    end
  end
end
