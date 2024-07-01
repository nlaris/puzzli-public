class Game < ApplicationRecord
  has_many :game_tiles, dependent: :destroy
  has_many :tiles, through: :game_tiles
end
