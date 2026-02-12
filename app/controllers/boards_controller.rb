class BoardsController < ApplicationController
  def index
    @boards = Board.all
  end

  def show
    @board = Board.find_by!(slug: params[:id])
    @posts = @board.posts.order(created_at: :desc).page(params[:page]).per(20)
  end
end
