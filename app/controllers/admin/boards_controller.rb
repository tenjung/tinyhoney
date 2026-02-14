module Admin
  class BoardsController < Admin::ApplicationController
    before_action :set_board, only: [ :edit, :update, :destroy ]

    def index
      @boards = Board.order(:id)
    end

    def new
      @board = Board.new
    end

    def create
      @board = Board.new(board_params)
      if @board.save
        redirect_to admin_boards_path, notice: "게시판이 생성되었습니다."
      else
        render :new
      end
    end

    def edit
    end

    def update
      if @board.update(board_params)
        redirect_to admin_boards_path, notice: "게시판이 수정되었습니다."
      else
        render :edit
      end
    end

    def destroy
      @board.destroy
      redirect_to admin_boards_path, notice: "게시판이 삭제되었습니다."
    end

    private

    def set_board
      @board = Board.find_by!(slug: params[:id])
    end

    def board_params
      params.require(:board).permit(:name, :slug, :description)
    end
  end
end
