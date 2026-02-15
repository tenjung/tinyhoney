class AddNameToSolidQueueProcesses < ActiveRecord::Migration[8.0]
  def up
    return unless table_exists?(:solid_queue_processes)

    unless column_exists?(:solid_queue_processes, :name)
      add_column :solid_queue_processes, :name, :string
    end

    execute <<~SQL.squish
      UPDATE solid_queue_processes
      SET name = COALESCE(NULLIF(name, ''), kind, 'process')
      WHERE name IS NULL OR name = ''
    SQL

    change_column_null :solid_queue_processes, :name, false

    unless index_exists?(:solid_queue_processes, [ :name, :supervisor_id ], unique: true)
      add_index :solid_queue_processes, [ :name, :supervisor_id ],
                unique: true,
                name: "index_solid_queue_processes_on_name_and_supervisor_id"
    end
  end

  def down
    return unless table_exists?(:solid_queue_processes)

    if index_exists?(:solid_queue_processes, [ :name, :supervisor_id ], unique: true)
      remove_index :solid_queue_processes, name: "index_solid_queue_processes_on_name_and_supervisor_id"
    end

    remove_column :solid_queue_processes, :name if column_exists?(:solid_queue_processes, :name)
  end
end
