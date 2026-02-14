class EventsController < ApplicationController
  def index
    @events = Event.all

    # 탭 필터 (진행중 / 마감)
    @current_tab = params[:tab] || "ongoing"
    case @current_tab
    when "closed"
      @events = @events.where("end_date < ?", Date.today)
    else # "ongoing"
      @events = @events.where("end_date >= ?", Date.today)
    end

    # 키워드 검색 (제목, 주최사)
    if params[:q].present?
      keyword = ActiveRecord::Base.sanitize_sql_like(params[:q].to_s.strip)
      @events = @events.where("title ILIKE ? OR organizer ILIKE ?", "%#{keyword}%", "%#{keyword}%")
    end

    # 카테고리 필터
    if params[:platform_type].present?
      @events = @events.where(platform_type: params[:platform_type])
    end

    # 응모형태 필터
    if params[:entry_type].present?
      @events = @events.where(entry_type: params[:entry_type])
    end

    # 진행 상태 필터 (진행중 탭에서만 유효)
    if @current_tab == "ongoing" && params[:status] == "ending_soon"
      @events = @events.where("end_date >= ? AND end_date <= ?", Date.today, Date.today + 3.days)
    end

    # 정렬
    @events = case params[:sort]
    when "winner_desc"
      @events.order(winner_count: :desc, created_at: :desc)
    when "ending_soon"
      @events.order(Arel.sql("CASE WHEN end_date IS NULL THEN 1 ELSE 0 END, end_date ASC"))
    else
      @events.order(created_at: :desc)
    end

    @events = @events.limit(50)

    # 통계
    @total_count = Event.count
    @filtered_count = @events.size
    @ongoing_count = Event.where("end_date >= ?", Date.today).count
    @closed_count = Event.where("end_date < ?", Date.today).count
    @ending_soon_count = Event.where("end_date >= ? AND end_date <= ?", Date.today, Date.today + 3.days).count
  end

  def show
    @event = Event.find(params[:id])
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
