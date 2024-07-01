class CreateGameTiles < ActiveRecord::Migration[7.1]
  def change
    create_table :game_tiles do |t|
      t.references :game, null: false, foreign_key: true
      t.references :tile, null: false, foreign_key: true

      t.index [:game_id, :tile_id], name: 'game_tile', unique: true
    end
  end
end
