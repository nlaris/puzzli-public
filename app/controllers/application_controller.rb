class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token, raise: false

  def routing_error
    render json: { error: 'Not Found' }, status: :not_found
  end
end 