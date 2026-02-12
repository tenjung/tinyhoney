class PostsController < ApplicationController
  before_action :authenticate_user!, except: [:show]
  before_action :set_board

  def show
    @post = @board.posts.find(params[:id])
    @comments = @post.comments.order(created_at: :asc)
    @comment = Comment.new
  end

  def new
    @post = @board.posts.new
  end

  def create
    @post = @board.posts.new(post_params)
    @post.user = current_user
    
    if @post.save
      redirect_to board_post_path(@board.slug, @post), notice: "게시글이 등록되었습니다."
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def set_board
    @board = Board.find_by!(slug: params[:board_id])
  end

  def post_params
    params.require(:post).permit(:title, :content)
  end
end
