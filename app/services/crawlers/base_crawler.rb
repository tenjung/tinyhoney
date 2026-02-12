require "open-uri"

module Crawlers
  class BaseCrawler
    def self.call(...)
      new(...).call
    end

    def call
      raise NotImplementedError, "#{self.class} must implement #call"
    end

    protected

    def find_or_create_deal(attributes)
      deal = Deal.find_or_initialize_by(url: attributes[:url])
      
      # Only update if the price changed or it's a new record
      if deal.new_record? || deal.price != attributes[:price].to_i
        deal.assign_attributes(attributes)
        deal.save!
        notify_users(deal) if deal.saved_change_to_id? || deal.saved_change_to_price?
      end
      
      deal
    end

    def notify_users(deal)
      # Phase 1: Keyword matching and real-time notification
      User.where(alert_enabled: true).each do |user|
        if user.keywords.any? { |keyword| deal.title.include?(keyword) }
          # ActionCable broadcast
          broadcast_notification(user, deal)
          
          # Email notification
          DealMailer.hot_deal_alert(user, deal).deliver_later
        end
      end
    end

    def broadcast_notification(user, deal)
      ActionCable.server.broadcast(
        "notifications_#{user.id}",
        {
          title: "New Hot Deal Matched!",
          message: deal.title,
          url: deal.url,
          price: deal.price
        }
      )
    end
  end
end
