class RevertSolidQueueKindName < ActiveRecord::Migration[7.1]
  def change
    rename_column :solid_queue_processes, :name, :kind
  end
end
