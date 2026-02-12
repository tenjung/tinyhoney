class UsersController < ApplicationRecord
  before_action :authenticate_user!

  def show
    @user = current_user
  end

  def update
    @user = current_user
    
    # Parse comma-separated keywords from text field
    if params[:keyword_list].present?
      @user.keywords = params[:keyword_list].split(",").map(&:strip).reject(&:blank?)
    end

    if @user.update(user_params)
      redirect_to profile_path, notice: "성공적으로 업데이트되었습니다."
    else
      render :show, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:alert_enabled, keywords: [])
  end
end
