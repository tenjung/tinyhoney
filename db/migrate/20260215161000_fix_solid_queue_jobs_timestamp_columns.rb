class FixSolidQueueJobsTimestampColumns < ActiveRecord::Migration[8.0]
  def up
    return unless table_exists?(:solid_queue_jobs)

    if column_exists?(:solid_queue_jobs, :scheduled_at, :integer)
      change_column :solid_queue_jobs, :scheduled_at, :datetime, using: "to_timestamp(scheduled_at)"
    end

    if column_exists?(:solid_queue_jobs, :finished_at, :integer)
      change_column :solid_queue_jobs, :finished_at, :datetime, using: "to_timestamp(finished_at)"
    end
  end

  def down
    return unless table_exists?(:solid_queue_jobs)

    if column_exists?(:solid_queue_jobs, :scheduled_at, :datetime)
      change_column :solid_queue_jobs, :scheduled_at, :integer, using: "extract(epoch from scheduled_at)"
    end

    if column_exists?(:solid_queue_jobs, :finished_at, :datetime)
      change_column :solid_queue_jobs, :finished_at, :integer, using: "extract(epoch from finished_at)"
    end
  end
end
