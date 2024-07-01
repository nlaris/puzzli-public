class AddNumSolutionsToGame < ActiveRecord::Migration[7.1]
  def change
    add_column :games, :num_solutions, :integer, null: false, default: 0
  end
end
