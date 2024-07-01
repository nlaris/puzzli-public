require 'date'

class Mutations::SubmitUserGame < Mutations::BaseMutation
  description "Submit a user's game"

  argument :input, Types::UserSubmissionInputType, required: true
  type Types::UserSubmissionOutputType, null:true
  
  def resolve(args)
    @params = args[:input]
    date = @params[:date]
    tile_data = @params[:tiles]
    user_id = @params[:user_id]
    elapsed_time = @params[:elapsed_time]

    raise "Invalid tiles" if tile_data.length != 9

    @game = Game.find_by(date: date)
    raise "Game for this date does not exist" if @game.nil?

    @user_stat = UserStat.find_by(user_id: user_id) || UserStat.new(user_id: user_id)
    return { success: true, solved: true, streak: @user_stat.streak, errors: ["User has already completed today's game"]}  if @user_stat.last_completed_date === date

    if Helper::submission_solved?(tile_data)
      streak = @user_stat.last_completed_date === (Date.parse(date) - 1).strftime("%Y-%m-%d") ? @user_stat.streak + 1 : 1
      @user_stat.streak = streak
      @user_stat.last_completed_date = date
      @user_stat.save!
      return { success: true, solved: true, streak: streak }
    end
    { success: true, solved: false }
  rescue => e
    { success: false, errors: [e]}
  end
end