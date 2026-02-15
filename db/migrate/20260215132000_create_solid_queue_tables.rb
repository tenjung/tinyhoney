class CreateSolidQueueTables < ActiveRecord::Migration[7.1]
  def change
    create_table :solid_queue_jobs do |t|
      t.string :queue_name, null: false
      t.string :class_name, null: false
      t.text :arguments
      t.integer :priority, default: 0, null: false
      t.string :active_job_id
      t.datetime :scheduled_at
      t.datetime :finished_at
      t.string :concurrency_key

      t.timestamps
    end

    add_index :solid_queue_jobs, [ :queue_name, :finished_at ], name: "index_solid_queue_jobs_for_filtering"
    add_index :solid_queue_jobs, [ :scheduled_at, :finished_at ], name: "index_solid_queue_jobs_for_alerting"

    create_table :solid_queue_scheduled_executions do |t|
      t.references :job, index: { unique: true }, null: false
      t.string :queue_name, null: false
      t.integer :priority, default: 0, null: false
      t.datetime :scheduled_at, null: false

      t.datetime :created_at, null: false

      t.index [ :scheduled_at, :priority, :job_id ], name: "index_solid_queue_dispatch_all"
    end

    create_table :solid_queue_ready_executions do |t|
      t.references :job, index: { unique: true }, null: false
      t.string :queue_name, null: false
      t.integer :priority, default: 0, null: false

      t.datetime :created_at, null: false

      t.index [ :priority, :job_id ], name: "index_solid_queue_poll_all"
      t.index [ :queue_name, :priority, :job_id ], name: "index_solid_queue_poll_by_queue"
    end

    create_table :solid_queue_claimed_executions do |t|
      t.references :job, index: { unique: true }, null: false
      t.references :process, index: true, null: false
      t.datetime :created_at, null: false

      t.index [ :process_id, :job_id ], name: "index_solid_queue_claimed_executions_on_process_id_and_job_id"
    end

    create_table :solid_queue_blocked_executions do |t|
      t.references :job, index: { unique: true }, null: false
      t.string :queue_name, null: false
      t.integer :priority, default: 0, null: false
      t.string :concurrency_key, null: false
      t.datetime :expires_at, null: false

      t.datetime :created_at, null: false

      t.index [ :concurrency_key, :priority, :job_id ], name: "index_solid_queue_blocked_executions_for_release"
      t.index [ :expires_at, :concurrency_key ], name: "index_solid_queue_blocked_executions_for_maintenance"
    end

    create_table :solid_queue_failed_executions do |t|
      t.references :job, index: { unique: true }, null: false
      t.text :error
      t.datetime :created_at, null: false

      t.index :job_id, unique: true
    end

    create_table :solid_queue_pauses do |t|
      t.string :queue_name, null: false
      t.datetime :created_at, null: false

      t.index :queue_name, unique: true
    end

    create_table :solid_queue_processes do |t|
      t.string :kind, null: false
      t.datetime :last_heartbeat_at, null: false
      t.bigint :supervisor_id, index: true

      t.integer :pid, null: false
      t.string :hostname
      t.text :metadata

      t.datetime :created_at, null: false
    end

    create_table :solid_queue_semaphores do |t|
      t.string :key, null: false
      t.integer :value, default: 1, null: false
      t.datetime :expires_at, null: false

      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false

      t.index [ :key, :value ], name: "index_solid_queue_semaphores_on_key_and_value"
      t.index :expires_at, name: "index_solid_queue_semaphores_on_expires_at"
    end

    create_table :solid_queue_recurring_executions do |t|
      t.references :job, index: { unique: true }, null: false
      t.string :task_key, null: false
      t.datetime :run_at, null: false
      t.datetime :created_at, null: false

      t.index [ :task_key, :run_at ], name: "index_solid_queue_recurring_executions_on_task_key_and_run_at", unique: true
    end

    # 2026-02-14: Added recurring task table for scheduled jobs (cron)
    create_table :solid_queue_recurring_tasks do |t|
      t.string :key, null: false
      t.string :schedule, null: false
      t.string :command, limit: 2048
      t.string :class_name
      t.text :arguments
      t.string :queue_name
      t.integer :priority, default: 0
      t.boolean :static, default: true, null: false
      t.text :description

      t.timestamps

      t.index :key, unique: true
      t.index :static
    end
  end
end
