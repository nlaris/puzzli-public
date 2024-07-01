# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :game_of_the_day, resolver: Resolvers::GameOfTheDay
  end
end
