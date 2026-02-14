class DashboardController < ApplicationController
  def index
    @recent_deals = Deal.all

    if params[:source].present?
      @recent_deals = @recent_deals.where(source: params[:source].upcase)
    end

    if params[:q].present?
      keyword = ActiveRecord::Base.sanitize_sql_like(params[:q].to_s.strip)
      @recent_deals = @recent_deals.where("title ILIKE ?", "%#{keyword}%")
    end

    if params[:only_lowest] == "1"
      @recent_deals = @recent_deals.where(is_lowest: true)
    end

    @recent_deals =
      case params[:sort]
      when "price_asc"
        @recent_deals.order(price: :asc, posted_at: :desc)
      when "price_desc"
        @recent_deals.order(price: :desc, posted_at: :desc)
      else
        @recent_deals.order(posted_at: :desc)
      end

    @recent_deals = @recent_deals.limit(40)
    @total_deal_count = Deal.count
    @filtered_count = @recent_deals.size
    @lowest_count = @recent_deals.count(&:is_lowest?)
    @lowest_price_deals = Deal.where(is_lowest: true).order(posted_at: :desc).limit(5)
  end
end
