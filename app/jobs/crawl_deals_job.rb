class CrawlDealsJob < ApplicationJob
  queue_as :default

  CRAWLERS = [
    Crawlers::PpombbuCrawler,
    Crawlers::RuliwebCrawler,
    Crawlers::QuasarzoneCrawler,
    Crawlers::AmisaeCrawler,
    Crawlers::ClienCrawler,
    Crawlers::ArcaLiveCrawler
  ].freeze

  def perform
    CRAWLERS.each do |crawler|
      crawler.call
    rescue StandardError => e
      Rails.logger.error("[CrawlDealsJob] #{crawler.name} failed: #{e.class} - #{e.message}")
    end
  end
end
