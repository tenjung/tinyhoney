module Crawlers
  class RuliwebCrawler < BaseCrawler
    BASE_URL = "https://bbs.ruliweb.com/market/board/1020"

    def call
      doc = Nokogiri::HTML(URI.open(BASE_URL).read)
      
      doc.css("tr.table_body").each do |row|
        title_element = row.css("a.subject_link").first
        next unless title_element

        title = title_element.text.strip
        url = title_element["href"]
        
        # Ruliweb often has price in tag or title
        price_match = title.match(/[\d,]+[원|₩|\$]/)
        price = price_match ? price_match[0].gsub(/[^\d]/, "").to_i : 0

        # Thumbnail might be in a separate column or not present in list
        thumb_element = row.css("img.thumb").first
        thumbnail_url = thumb_element ? thumb_element["src"] : nil

        find_or_create_deal(
          title: title,
          url: url,
          source: "RULIWEB",
          category: "GENERAL",
          price: price,
          thumbnail_url: thumbnail_url,
          posted_at: Time.current
        )
      end
    rescue => e
      Rails.logger.error "RuliwebCrawler Error: #{e.message}"
    end
  end
end
