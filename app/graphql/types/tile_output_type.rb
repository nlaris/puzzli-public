class Types::TileOutputType < Types::BaseObject
  description "A tile to be used in a game"

  field :id, ID, null: false
  field :pattern, String, null: false
  field :rotation, Integer, null: false
  field :adjusted_pattern, String, null: false
  field :solution_index, Integer, null: false
end