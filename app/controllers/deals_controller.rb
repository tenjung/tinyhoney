class DealsController < ApplicationController
  def index
    @deals = Deal.order(posted_at: :desc).page(params[:page])
  end

  def show
    @deal = Deal.find(params[:id])
    @price_history = @deal.price_histories.group_by_day(:created_at).average(:recorded_price)
  end
end
