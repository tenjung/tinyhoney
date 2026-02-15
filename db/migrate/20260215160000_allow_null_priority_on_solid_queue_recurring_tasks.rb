class AllowNullPriorityOnSolidQueueRecurringTasks < ActiveRecord::Migration[8.0]
  def change
    return unless table_exists?(:solid_queue_recurring_tasks)
    return unless column_exists?(:solid_queue_recurring_tasks, :priority)

    change_column_null :solid_queue_recurring_tasks, :priority, true
  end
end
