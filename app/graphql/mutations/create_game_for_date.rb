class Mutations::CreateGameForDate < Mutations::BaseMutation
  description "Create game for a date"

  argument :input, Types::GameInputType, required: true
  type Boolean, null: false

  def resolve(args)
    GameCreator.create_game(args[:input][:date])
    true
  rescue => e
    false
  end
end
  