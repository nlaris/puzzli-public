class CreateTiles < ActiveRecord::Migration[7.1]
  def change
    create_table :tiles do |t|
      t.string :pattern
      t.integer :rotation

      t.timestamps
    end

    add_index :tiles, %i[pattern rotation], unique: true
  end
end
