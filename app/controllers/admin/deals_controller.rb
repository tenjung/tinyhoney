module Admin
  class DealsController < Admin::ApplicationController
    before_action :set_deal, only: [ :show, :edit, :update, :destroy ]

    def index
      @deals = Deal.order(created_at: :desc).page(params[:page]).per(20)
      if params[:q].present?
        keyword = ActiveRecord::Base.sanitize_sql_like(params[:q])
        @deals = @deals.where("title ILIKE ? OR shop_name ILIKE ?", "%#{keyword}%", "%#{keyword}%")
      end
    end

    def show
    end

    def new
      @deal = Deal.new
    end

    def create
      @deal = Deal.new(deal_params)
      if @deal.save
        redirect_to admin_deals_path, notice: "핫딜이 성공적으로 생성되었습니다."
      else
        render :new
      end
    end

    def edit
    end

    def update
      if @deal.update(deal_params)
        redirect_to admin_deals_path, notice: "핫딜이 성공적으로 수정되었습니다."
      else
        render :edit
      end
    end

    def destroy
      @deal.destroy
      redirect_to admin_deals_path, notice: "핫딜이 삭제되었습니다."
    end

    private

    def set_deal
      @deal = Deal.find(params[:id])
    end

    def deal_params
      params.require(:deal).permit(:title, :url, :shop_name, :category, :price, :shipping_fee, :is_lowest, :thumbnail_url, :description, :source)
    end
  end
end
