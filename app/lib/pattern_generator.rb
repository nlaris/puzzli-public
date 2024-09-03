module PatternGenerator
  def self.get_patterns
    characters = ['W', 'B']
    length = 8

    # Generate all combinations of B and W, but omit solid-colored tiles
    combinations = characters.repeated_permutation(length).map(&:join)
    combinations -= ["WWWWWWWW", "BBBBBBBB"]

    # Tiles will consider all 4 rotations and will be keyed by their base rotation
    # Omit secondary rotations for each distinct pattern to avoid duplicate tiles
    tile_patterns = []
    while combinations.present?
      pattern = combinations.first
      tile_patterns << pattern
      combinations -= get_rotated_patterns(pattern)
    end

    tile_patterns
  end

  def self.get_rotated_patterns(pattern)
    patterns = []
    4.times do |rotation|
      patterns << get_adjusted_pattern(pattern, rotation)
    end
    patterns
  end

  def self.get_adjusted_pattern(pattern, rotation)
    pattern[8 - (rotation * 2)..-1] << pattern[0..7 - (rotation * 2)]
  end
end