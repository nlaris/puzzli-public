module GameCreator
  def self.create_games(start_date, times)
    raise ArgumentError, "Too many games to create" if times > 500
    end_date = start_date + times - 1
    dates_skipped = []
    games_created = 0
    for date in start_date..end_date
      begin
        create_game(date)
        games_created += 1
      rescue => e
        dates_skipped << date
        Rails.logger.debug e
      end
    end
    Rails.logger.debug "Skipped dates: #{dates_skipped.map{ |date| date.strftime "%Y-%m-%d" }}" if dates_skipped.present?
    Rails.logger.debug "Created #{games_created} games between #{start_date} and #{end_date}"
    games_created
  rescue => e
    Rails.logger.error e
    0
  end

  def self.create_game(date)
    raise ArgumentError, "Game already exists for date #{date}" if Game.find_by(date: date).present?
    tiles = get_new_tiles(date)
    ActiveRecord::Base.transaction do
      game = Game.create!({ date: date, num_solutions: count_solutions(tiles) })
      tiles.each_with_index do |tile, index|
        GameTile.create({
          game_id: game.id,
          tile_id: tile.id,
          solution_index: index
        })
      end
    end
  end

  private

  # Randomly pick 9 valid tiles for a newly created game, ensuring at least 1 solution exists
  def self.get_new_tiles(date)
    all_tiles = Tile.all
    # Begin with one tile in the upper-left corner
    game_tiles = [all_tiles.sample]

    for position in 1..8
      current_patterns = game_tiles.map { |tile| tile.pattern }
      # Don't pick a tile that is a rotated version of an already chosen tile
      valid_tiles = all_tiles.filter { |tile| current_patterns.exclude?(tile.pattern) }
      # Filter out tiles that will not fit to the right of its left adjacent tile (if applicable)
      valid_tiles = valid_tiles.select { |tile| Helper::left_right_valid?(game_tiles[position - 1], tile) } if position % 3 > 0
      # Filter out tiles that will not fit below its above adjacent tile (if applicable)
      valid_tiles = valid_tiles.select { |tile| Helper::top_bottom_valid?(game_tiles[position - 3], tile) } if position > 2
      # Pick a random tile from the remaining valid tiles
      game_tiles.push(valid_tiles.sample)
    end
    game_tiles
  end

  # Recursively build out all potential tile combinations, counting all valid solutions
  def self.count_solutions(remaining_tiles, puzzle_tiles = [])
    return 1 if remaining_tiles.empty?
    count = 0
    remaining_tiles.each do |tile|
      # Only continue building this combination if placing this tile does not break the win condition
      count += count_solutions(remaining_tiles - [tile], puzzle_tiles + [tile]) if tile_valid?(puzzle_tiles, tile)
    end
    count
  end

  def self.tile_valid?(puzzle_tiles, tile)
    return true if puzzle_tiles.empty?
    if puzzle_tiles.length % 3 > 0
      return false unless Helper::left_right_valid?(puzzle_tiles[puzzle_tiles.length - 1], tile)
    end
    if puzzle_tiles.length >= 3
      return false unless Helper::top_bottom_valid?(puzzle_tiles[puzzle_tiles.length - 3], tile)
    end
    true
  end
end