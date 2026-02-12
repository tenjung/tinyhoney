class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email
      t.jsonb :keywords
      t.boolean :alert_enabled

      t.timestamps
    end
  end
end
