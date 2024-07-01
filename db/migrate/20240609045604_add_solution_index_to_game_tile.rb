class AddSolutionIndexToGameTile < ActiveRecord::Migration[7.1]
  def change
    add_column :game_tiles, :solution_index, :integer, null: false, default: 0
  end
end
