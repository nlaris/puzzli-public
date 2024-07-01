tile_count = 0
Constants::PATTERNS.each do |pattern|
  4.times do |rotation|
    if Tile.find_by(pattern: pattern, rotation: rotation).nil?
      Tile.create!(pattern: pattern, rotation: rotation)
      tile_count += 1
    end
  end
end
p "Created #{tile_count} Tiles - #{Tile.count} total Tiles"
