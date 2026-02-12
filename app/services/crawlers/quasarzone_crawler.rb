module Crawlers
  class QuasarzoneCrawler < BaseCrawler
    BASE_URL = "https://quasarzone.com/bbs/qb_saleinfo"

    def call
      doc = Nokogiri::HTML(URI.open(BASE_URL).read)
      
      doc.css("div.market-info-list-cont").each do |item|
        title_element = item.css("span.tit a").first
        next unless title_element

        title = title_element.text.strip
        url = URI.join("https://quasarzone.com", title_element["href"]).to_s
        
        # Price is often in span.text-orange
        price_element = item.css("span.text-orange").first
        price = price_element ? price_element.text.gsub(/[^\d]/, "").to_i : 0

        # Thumbnail
        thumb_element = item.css("img").first
        thumbnail_url = thumb_element ? thumb_element["src"] : nil

        find_or_create_deal(
          title: title,
          url: url,
          source: "QUASARZONE",
          category: "IT",
          price: price,
          thumbnail_url: thumbnail_url,
          posted_at: Time.current
        )
      end
    rescue => e
      Rails.logger.error "QuasarzoneCrawler Error: #{e.message}"
    end
  end
end
