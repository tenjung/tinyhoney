class Event < ApplicationRecord
  enum :platform_type, { web: "WEB", app: "APP" }, default: "web"

  validates :title, :url, presence: true
end
