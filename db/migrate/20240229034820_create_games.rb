class CreateGames < ActiveRecord::Migration[7.1]
  def change
    create_table :games do |t|
      t.string :date, index: {unique: true}

      t.timestamps
    end
  end
end
