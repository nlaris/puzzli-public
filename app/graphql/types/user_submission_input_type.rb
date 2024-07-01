class Types::UserSubmissionInputType < Types::BaseInputObject
  description "User submission"

  argument :user_id, String, required: true
  argument :date, String, required: true
  argument :elapsed_time, Integer, required: true
  argument :tiles, [Types::TileInputType], required: true
end