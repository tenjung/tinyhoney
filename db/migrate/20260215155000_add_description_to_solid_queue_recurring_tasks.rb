class AddDescriptionToSolidQueueRecurringTasks < ActiveRecord::Migration[8.0]
  def change
    return unless table_exists?(:solid_queue_recurring_tasks)
    return if column_exists?(:solid_queue_recurring_tasks, :description)

    add_column :solid_queue_recurring_tasks, :description, :text
  end
end
