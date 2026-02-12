class EventsController < ApplicationController
  def index
    @events = Event.all.order(created_at: :desc)
    if params[:platform_type].present?
      @events = @events.where(platform_type: params[:platform_type])
    end
  end

  def new
    @event = Event.new
  end

  def create
    @event = Event.new(event_params)
    @event.is_manual = true
    
    if @event.save
      redirect_to events_path, notice: "이벤트가 성공적으로 등록되었습니다."
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def event_params
    params.require(:event).permit(:title, :url, :platform_type, :description, :thumbnail_url)
  end
end
