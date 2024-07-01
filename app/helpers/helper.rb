module Helper
  # Returns true if the provided tile order is a valid solution
  def self.submission_solved?(tile_data)
    tiles = []
    tile_data.each { |tile| tiles.push(Tile.find_by(pattern: tile.pattern, rotation: tile.rotation)) }
    tiles.each_with_index do |tile, pos|
      return false if tile.nil?
      if pos % 3 > 0
        return false unless Helper::left_right_valid?(tiles[pos - 1], tile)
      end
      if pos >= 3
        return false unless top_bottom_valid?(tiles[pos - 3], tile)
      end
    end
    true
  end

  # Returns true if the bottom edge of top_tile matches the upper edge of bottom_tile
  def self.top_bottom_valid?(top_tile, bottom_tile)
    (top_tile.get_position(5).eql? bottom_tile.get_position(2)) && (top_tile.get_position(6).eql? bottom_tile.get_position(1))
  end

  # Returns true if the right edge of left_tile matches the left edge of right_tile
  def self.left_right_valid?(left_tile, right_tile)
    (left_tile.get_position(3).eql? right_tile.get_position(0)) && (left_tile.get_position(4).eql? right_tile.get_position(7))
  end
end