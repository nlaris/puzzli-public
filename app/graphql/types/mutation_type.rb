# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_game_for_date, mutation: Mutations::CreateGameForDate
    field :submit_user_game, mutation: Mutations::SubmitUserGame
  end
end
