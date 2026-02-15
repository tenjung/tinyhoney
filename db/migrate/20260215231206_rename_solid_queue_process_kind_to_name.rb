class RenameSolidQueueProcessKindToName < ActiveRecord::Migration[7.1]
  def change
    rename_column :solid_queue_processes, :kind, :name
  end
end
