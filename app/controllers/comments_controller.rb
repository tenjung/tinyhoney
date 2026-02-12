class CommentsController < ApplicationController
  before_action :authenticate_user!

  def create
    @post = Post.find(params[:post_id])
    @comment = @post.comments.new(comment_params)
    @comment.user = current_user

    if @comment.save
      redirect_to board_post_path(@post.board.slug, @post), notice: "댓글이 작성되었습니다."
    else
      redirect_to board_post_path(@post.board.slug, @post), alert: "댓글 작성을 실패했습니다."
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:content)
  end
end
