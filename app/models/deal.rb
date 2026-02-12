class Deal < ApplicationRecord
  has_many :price_histories, dependent: :destroy

  validates :title, :url, :source, presence: true
  validates :url, uniqueness: true

  after_save :record_price_history, if: :saved_change_to_price?

  def affiliate_url
    AffiliateManager.convert(url)
  end

  def discount_rate
    return 0 if price_histories.count < 2
    avg_price = price_histories.average(:recorded_price).to_f
    return 0 if avg_price.zero?
    
    ((avg_price - price) / avg_price * 100).round(1)
  end

  def good_deal?
    discount_rate >= 10 || is_lowest?
  end

  private

  def record_price_history
    price_histories.create!(recorded_price: price)
  end
end
