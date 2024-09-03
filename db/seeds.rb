tile_count = 0
PatternGenerator::get_patterns.each do |pattern|
  4.times do |rotation|
    tiles = Tile.where(pattern: pattern)
    if tiles.map { |tile| tile.adjusted_pattern }.exclude? PatternGenerator::get_adjusted_pattern(pattern, rotation)
      Tile.create!(pattern: pattern, rotation: rotation)
      tile_count += 1
    end
  end
end
p "Created #{tile_count} Tiles - #{Tile.count} total Tiles"



