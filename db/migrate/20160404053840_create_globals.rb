class CreateGlobals < ActiveRecord::Migration
  def change
    create_table :globals, id: :uuid  do |t|
      t.string :name
      t.string :symbol
      t.string :value
      t.uuid :unit_id
      
      t.boolean :shared
      t.belongs_to  :user, index: true

      t.datetime :deleted, index: true
      t.integer :lock_version, default: 0, null: false

      t.timestamps null: false
    end
  end
end