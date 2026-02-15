class CreateSolidQueueTables < ActiveRecord::Migration[7.1]
  def change
    unless table_exists?(:solid_queue_jobs)
      create_table :solid_queue_jobs do |t|
        t.string :queue_name, null: false
        t.string :class_name, null: false, index: true
        t.text :arguments
        t.integer :priority, default: 0, null: false
        t.string :active_job_id, index: true
        t.integer :scheduled_at
        t.integer :finished_at
        t.string :concurrency_key
        t.timestamps
      end
    end

    unless table_exists?(:solid_queue_scheduled_executions)
      create_table :solid_queue_scheduled_executions do |t|
        t.references :job, index: { unique: true }, foreign_key: { to_table: :solid_queue_jobs, on_delete: :cascade }
        t.datetime :scheduled_at, null: false
        t.integer :priority, default: 0, null: false
        t.string :concurrency_key
        t.datetime :created_at, null: false
        t.index [ :scheduled_at, :priority, :job_id ], name: "index_solid_queue_dispatch_all"
      end
    end

    unless table_exists?(:solid_queue_ready_executions)
      create_table :solid_queue_ready_executions do |t|
        t.references :job, index: { unique: true }, foreign_key: { to_table: :solid_queue_jobs, on_delete: :cascade }
        t.string :queue_name, null: false
        t.integer :priority, default: 0, null: false
        t.datetime :created_at, null: false
        t.index [ :priority, :job_id ], name: "index_solid_queue_poll_all"
        t.index [ :queue_name, :priority, :job_id ], name: "index_solid_queue_poll_by_queue"
      end
    end

    unless table_exists?(:solid_queue_claimed_executions)
      create_table :solid_queue_claimed_executions do |t|
        t.references :job, index: { unique: true }, foreign_key: { to_table: :solid_queue_jobs, on_delete: :cascade }
        t.bigint :process_id
        t.datetime :created_at, null: false
        t.index [ :process_id, :job_id ]
      end
    end

    unless table_exists?(:solid_queue_blocked_executions)
      create_table :solid_queue_blocked_executions do |t|
        t.references :job, index: { unique: true }, foreign_key: { to_table: :solid_queue_jobs, on_delete: :cascade }
        t.string :queue_name, null: false
        t.integer :priority, default: 0, null: false
        t.string :concurrency_key, null: false
        t.datetime :expires_at, null: false
        t.datetime :created_at, null: false
        t.index [ :expires_at, :concurrency_key ], name: "index_solid_queue_blocked_executions_for_release"
        t.index [ :concurrency_key, :priority, :job_id ], name: "index_solid_queue_blocked_executions_for_acquire"
      end
    end

    unless table_exists?(:solid_queue_failed_executions)
      create_table :solid_queue_failed_executions do |t|
        t.references :job, index: { unique: true }, foreign_key: { to_table: :solid_queue_jobs, on_delete: :cascade }
        t.text :error
        t.text :error_detail
        t.datetime :created_at, null: false
      end
    end

    unless table_exists?(:solid_queue_pauses)
      create_table :solid_queue_pauses do |t|
        t.string :queue_name, null: false, index: { unique: true }
        t.datetime :created_at, null: false
      end
    end

    unless table_exists?(:solid_queue_processes)
      create_table :solid_queue_processes do |t|
        t.string :kind, null: false
        t.datetime :last_heartbeat_at, null: false, index: true
        t.datetime :created_at, null: false
        t.string :supervisor_id, index: true
        t.integer :pid, null: false
        t.string :hostname
        t.text :metadata
      end
    end

    unless table_exists?(:solid_queue_semaphores)
      create_table :solid_queue_semaphores do |t|
        t.string :key, null: false, index: { unique: true }
        t.integer :value, default: 1, null: false
        t.datetime :expires_at, null: false, index: true
        t.datetime :created_at, null: false
        t.datetime :updated_at, null: false
      end
    end
  end
end
