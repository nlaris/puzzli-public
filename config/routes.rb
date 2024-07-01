Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    resources :games
    resources :users
    resources :user_stats
    resources :game_tiles
  end

  # GraphQL endpoint for both POST and GET requests
  match "/graphql", to: "graphql#execute", via: [:post, :get]

  root to: "application#routing_error"

  # Catch-all route for undefined routes to handle 404 errors
  match '*path', to: 'application#routing_error', via: :all
end
