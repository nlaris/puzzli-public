class Types::TileInputType < Types::BaseInputObject
  description "Tile to be used in user submission"

  argument :pattern, String, required: true
  argument :rotation, Integer, required: true
end