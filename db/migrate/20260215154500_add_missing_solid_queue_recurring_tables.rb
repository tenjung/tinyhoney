class AddMissingSolidQueueRecurringTables < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:solid_queue_recurring_tasks)
      create_table :solid_queue_recurring_tasks do |t|
        t.string :key, null: false
        t.string :schedule, null: false
        t.string :command
        t.string :class_name
        t.text :arguments
        t.string :queue_name
        t.integer :priority, default: 0, null: false
        t.boolean :static, default: true, null: false
        t.timestamps
      end

      add_index :solid_queue_recurring_tasks, :key, unique: true
      add_index :solid_queue_recurring_tasks, :static
    end

    unless table_exists?(:solid_queue_recurring_executions)
      create_table :solid_queue_recurring_executions do |t|
        t.references :job, index: { unique: true }, foreign_key: { to_table: :solid_queue_jobs, on_delete: :cascade }
        t.string :task_key, null: false
        t.datetime :run_at, null: false
        t.timestamps
      end

      add_index :solid_queue_recurring_executions, [ :task_key, :run_at ],
                unique: true,
                name: "index_solid_queue_recurring_executions_on_task_key_and_run_at"
    end
  end
end
