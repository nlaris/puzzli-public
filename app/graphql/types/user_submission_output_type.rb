class Types::UserSubmissionOutputType < Types::BaseObject
  description "User submission output"

  field :success, Boolean, null: false
  field :streak, Integer, null: true
  field :errors, [String], null: true
  field :solved, Boolean, null: true
end