module Crawlers
  class ClienCrawler < BaseCrawler
    BASE_URL = "https://www.clien.net/service/board/jirum"

    def call
      doc = Nokogiri::HTML(URI.open(BASE_URL).read)
      
      doc.css("div.list_item").each do |item|
        title_element = item.css("span.subject_fixed").first
        next unless title_element

        title = title_element.text.strip
        link_element = item.css("a.list_subject").first
        next unless link_element
        url = URI.join("https://www.clien.net", link_element["href"]).to_s
        
        # Price match
        price_match = title.match(/[\d,]+[원|₩|\$]/)
        price = price_match ? price_match[0].gsub(/[^\d]/, "").to_i : 0

        find_or_create_deal(
          title: title,
          url: url,
          source: "CLIEN",
          category: "GENERAL",
          price: price,
          posted_at: Time.current
        )
      end
    rescue => e
      Rails.logger.error "ClienCrawler Error: #{e.message}"
    end
  end
end
