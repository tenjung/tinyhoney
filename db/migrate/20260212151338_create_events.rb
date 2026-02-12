class CreateEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :events do |t|
      t.string :title
      t.string :url
      t.string :platform_type
      t.boolean :is_manual
      t.text :description
      t.string :thumbnail_url

      t.timestamps
    end
  end
end
