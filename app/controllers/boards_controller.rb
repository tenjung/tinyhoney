class BoardsController < ApplicationController
  def index
    @boards = Board.all.order(:id)

    # 통계
    @total_boards = @boards.count
    @total_posts = Post.count
    @recent_posts = Post.order(created_at: :desc).limit(5)
  end

  def show
    @board = Board.find_by!(slug: params[:id])
    @posts = @board.posts.order(created_at: :desc).page(params[:page]).per(20)

    # 통계
    @total_posts = @board.posts.count
    @today_posts = @board.posts.where("created_at >= ?", Date.today).count
  end
end
