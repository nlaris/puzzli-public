require 'date'

class Resolvers::GameOfTheDay < Resolvers::BaseResolver
  description "Fetch game of the day"

  argument :input, Types::GameInputType, required: true
  type Types::GameOutputType, null: true

  def resolve(args)
    params = args[:input]
    game = Game.find_by(date: params[:date])

    return { success: false, date: params[:date], tiles: nil } if game.nil?

    { 
      success: true, 
      date: game.date, 
      tiles: build_tile_output(game.game_tiles),
      num_solutions: game.num_solutions
    }
  end

  def build_tile_output(game_tiles)
    game_tiles = game_tiles.sort_by { |gt| gt.tile_id }
    tiles_output = []
    game_tiles.each do |game_tile|
      tile = game_tile.tile
      tiles_output.push({
        id: tile.id, 
        pattern: tile.pattern, 
        rotation: tile.rotation,
        adjusted_pattern: tile.adjusted_pattern,
        solution_index: game_tile.solution_index
      }) 
    end
    # Tiles are provided in order of Tile ID, and may end up returning an order that is already solved.
    # This is super unlikely, but we want to check if they are so that we can return them in reverse if so.
    # We don't want to simply scramble the order because we want the order to be consistent for all users.
    Helper::submission_solved?(game_tiles.map { |gt| gt.tile }) ? tiles_output.reverse : tiles_output
  end
end