class Admin::BaseController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin!

  private

  def ensure_admin!
    unless current_user.admin?
      redirect_to root_path, alert: "관리자 권한이 없습니다."
    end
  end
end
