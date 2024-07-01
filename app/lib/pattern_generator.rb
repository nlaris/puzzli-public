module PatternGenerator
  # Generate a set of unique patterns, ensuring that all 4 of a piece's rotations
  # are also distinct from the other generated pieces
  def self.create_patterns(num_patterns)
    colors = ['B', 'W']
    patterns = []
    all_rotations = []
    while patterns.length < num_patterns
      pattern = ""
      8.times do
        pattern += colors.sample
      end
      if all_rotations.exclude? pattern
        patterns << pattern
        get_rotated_patterns(pattern).each do |p|
          all_rotations << p
        end
      end
    end
    patterns
  end

  def self.get_rotated_patterns(pattern)
    patterns = []
    4.times do |rotation|
      p = pattern[8 - (rotation * 2)..-1] << pattern[0..7 - (rotation * 2)]
      patterns << p
    end
    patterns
  end
end