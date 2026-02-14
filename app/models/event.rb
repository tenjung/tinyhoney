class Event < ApplicationRecord
  enum :platform_type, {
    web: "WEB",
    app: "APP",
    telecom: "통신사",
    appliance: "가전",
    game: "게임",
    food: "식품",
    fashion: "의류",
    digital: "디지털",
    furniture: "가구",
    beauty: "뷰티"
  }, default: "web"

  validates :title, :url, presence: true

  # Helper method to parse prize_tags JSON
  def prizes
    return [] if prize_tags.blank?
    JSON.parse(prize_tags) rescue []
  end
end
