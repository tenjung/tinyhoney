module Admin
  class EventsController < Admin::ApplicationController
    before_action :set_event, only: [ :show, :edit, :update, :destroy ]

    def index
      @events = Event.order(created_at: :desc).page(params[:page]).per(20)
      if params[:q].present?
        keyword = ActiveRecord::Base.sanitize_sql_like(params[:q])
        @events = @events.where("title ILIKE ? OR organizer ILIKE ?", "%#{keyword}%", "%#{keyword}%")
      end
    end

    def show
    end

    def new
      @event = Event.new
      @event.start_date = Date.today
      @event.end_date = Date.today + 7.days
    end

    def create
      @event = Event.new(event_params)
      @event.is_manual = true # Admin created events are manually managed

      if @event.save
        redirect_to admin_events_path, notice: "이벤트가 성공적으로 생성되었습니다."
      else
        render :new
      end
    end

    def edit
    end

    def update
      if @event.update(event_params)
        redirect_to admin_events_path, notice: "이벤트가 성공적으로 수정되었습니다."
      else
        render :edit
      end
    end

    def destroy
      @event.destroy
      redirect_to admin_events_path, notice: "이벤트가 삭제되었습니다."
    end

    private

    def set_event
      @event = Event.find(params[:id])
    end

    def event_params
      params.require(:event).permit(:title, :url, :organizer, :platform_type, :start_date, :end_date, :announcement_date, :winner_count, :entry_type, :thumbnail_url, :description, :prize_tags, :share_count, :bookmark_count)
    end
  end
end
