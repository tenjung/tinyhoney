class CreatePriceHistories < ActiveRecord::Migration[8.0]
  def change
    create_table :price_histories do |t|
      t.references :deal, null: false, foreign_key: true
      t.integer :recorded_price

      t.timestamps
    end
  end
end
