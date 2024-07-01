class Tile < ApplicationRecord
  has_many :game_tiles
  has_many :games, through: :game_tiles

  validates :pattern, length: {is: 8}
  validates :rotation, numericality: {greater_than_or_equal_to: 0, less_than_or_equal_to: 3}

  def adjusted_pattern
    pattern[8 - (rotation * 2)..-1] << pattern[0..7 - (rotation * 2)]
  end

  def get_position(pos)
    adjusted_pattern[pos]
  end
end
