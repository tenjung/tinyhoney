class CrawlDealsJob < ApplicationJob
  queue_as :default

  def perform
    # Crawl Ppomppu
    Crawlers::PpombbuCrawler.call

    # Crawl Ruliweb
    Crawlers::RuliwebCrawler.call

    # Crawl Quasarzone
    Crawlers::QuasarzoneCrawler.call

    # Crawl Amisae
    Crawlers::AmisaeCrawler.call

    # Crawl Clien
    Crawlers::ClienCrawler.call

    # Crawl ArcaLive
    Crawlers::ArcaLiveCrawler.call
  end
end
