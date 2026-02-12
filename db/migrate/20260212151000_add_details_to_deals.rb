class AddDetailsToDeals < ActiveRecord::Migration[8.0]
  def change
    add_column :deals, :thumbnail_url, :string
    add_column :deals, :description, :text
  end
end
