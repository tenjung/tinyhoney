module Admin
  class UsersController < Admin::ApplicationController
    def index
      @users = User.order(created_at: :desc).page(params[:page]).per(20)
      if params[:q].present?
        keyword = ActiveRecord::Base.sanitize_sql_like(params[:q])
        @users = @users.where("email ILIKE ? OR name ILIKE ?", "%#{keyword}%", "%#{keyword}%")
      end
    end

    def destroy
      @user = User.find(params[:id])
      @user.destroy
      redirect_to admin_users_path, notice: "회원이 삭제되었습니다."
    end
  end
end
