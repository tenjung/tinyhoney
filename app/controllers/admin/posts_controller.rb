module Admin
  class PostsController < Admin::ApplicationController
    def index
      @posts = Post.includes(:user, :board).order(created_at: :desc).page(params[:page]).per(20)
      if params[:q].present?
        keyword = ActiveRecord::Base.sanitize_sql_like(params[:q])
        @posts = @posts.where("title ILIKE ? OR content ILIKE ?", "%#{keyword}%", "%#{keyword}%")
      end
    end

    def destroy
      @post = Post.find(params[:id])
      @post.destroy
      redirect_to admin_posts_path, notice: "게시글이 삭제되었습니다."
    end
  end
end
