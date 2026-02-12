module Crawlers
  class ArcaLiveCrawler < BaseCrawler
    BASE_URL = "https://arca.live/b/hotdeal"

    def call
      doc = Nokogiri::HTML(URI.open(BASE_URL).read)
      
      doc.css("a.vrow").each do |row|
        title_element = row.css("span.title").first
        next unless title_element

        title = title_element.text.strip
        url = URI.join("https://arca.live", row["href"]).to_s
        
        # ArcaLive price is often in span.deal-price
        price_element = row.css("span.deal-price").first
        price = price_element ? price_element.text.gsub(/[^\d]/, "").to_i : 0

        # Thumbnail
        thumb_element = row.css("img").first
        thumbnail_url = thumb_element ? thumb_element["src"] : nil

        find_or_create_deal(
          title: title,
          url: url,
          source: "ARCALIVE",
          category: "GENERAL",
          price: price,
          thumbnail_url: thumbnail_url,
          posted_at: Time.current
        )
      end
    rescue => e
      Rails.logger.error "ArcaLiveCrawler Error: #{e.message}"
    end
  end
end
