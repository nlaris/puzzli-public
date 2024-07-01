class Types::GameOutputType < Types::BaseObject
  description "Output for fetching/creating the game of the day"

  field :success, Boolean, null: false
  field :errors, [String], null: true
  field :date, String, null: false
  field :tiles, [Types::TileOutputType], null: true
  field :num_solutions, Integer, null: true
end