class CreateDeals < ActiveRecord::Migration[8.0]
  def change
    create_table :deals do |t|
      t.string :title
      t.string :url
      t.string :source
      t.string :category
      t.integer :price
      t.boolean :is_lowest
      t.datetime :posted_at

      t.timestamps
    end
  end
end
