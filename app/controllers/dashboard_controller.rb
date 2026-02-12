class DashboardController < ApplicationController
  def index
    @recent_deals = Deal.all
    if params[:source].present?
      @recent_deals = @recent_deals.where(source: params[:source].upcase)
    end
    @recent_deals = @recent_deals.order(posted_at: :desc).limit(20)
    @lowest_price_deals = Deal.where(is_lowest: true).limit(5)
  end
end
