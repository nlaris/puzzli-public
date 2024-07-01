class Types::GameInputType < Types::BaseInputObject
  description "Input for fetching/creating the game of the day"

  argument :date, String, required: true
end