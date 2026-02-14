class AddEventDetailsToEvents < ActiveRecord::Migration[8.0]
  def change
    add_column :events, :organizer, :string          # 주최사
    add_column :events, :start_date, :date           # 응모 시작일
    add_column :events, :end_date, :date             # 응모 종료일
    add_column :events, :entry_type, :string         # 응모형태 (작문/댓글, 선착순 등)
    add_column :events, :announcement_date, :date    # 당첨자 발표일
    add_column :events, :winner_count, :integer      # 총 당첨자수
    add_column :events, :prize_tags, :text           # 경품태그 (JSON 배열로 저장)
    add_column :events, :share_count, :integer, default: 0  # 공유 횟수
    add_column :events, :bookmark_count, :integer, default: 0  # 북마크 횟수
  end
end
