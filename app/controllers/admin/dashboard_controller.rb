module Admin
  class DashboardController < Admin::ApplicationController
    def index
      @total_users = User.count
      @total_deals = Deal.count
      @total_events = Event.count
      @total_posts = Post.count

      @recent_users = User.order(created_at: :desc).limit(5)
      @recent_deals = Deal.order(created_at: :desc).limit(5)
      @recent_events = Event.order(created_at: :desc).limit(5)
    end
  end
end
