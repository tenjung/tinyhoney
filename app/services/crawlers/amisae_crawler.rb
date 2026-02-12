module Crawlers
  class AmisaeCrawler < BaseCrawler
    BASE_URL = "https://eomisae.co.kr/fs"

    def call
      doc = Nokogiri::HTML(URI.open(BASE_URL).read)
      
      doc.css("div.card").each do |card|
        title_element = card.css("h3.card-title a").first
        next unless title_element

        title = title_element.text.strip
        url = URI.join(BASE_URL, title_element["href"]).to_s
        
        # Amisae price often in title
        price_match = title.match(/[\d,]+[원|₩|\$]/)
        price = price_match ? price_match[0].gsub(/[^\d]/, "").to_i : 0

        # Thumbnail
        thumb_element = card.css("img.card-img-top").first
        thumbnail_url = thumb_element ? thumb_element["src"] : nil

        find_or_create_deal(
          title: title,
          url: url,
          source: "AMISAE",
          category: "FASHION",
          price: price,
          thumbnail_url: thumbnail_url,
          posted_at: Time.current
        )
      end
    rescue => e
      Rails.logger.error "AmisaeCrawler Error: #{e.message}"
    end
  end
end
