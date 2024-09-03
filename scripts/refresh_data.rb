#!/usr/bin/env ruby

require_relative '../config/environment'

Game.where('date < ?', Date.today - 1).destroy_all
Game.where('date > ?', Date.today + 10).destroy_all

GameCreator.create_games(Date.today, 10)

puts "Deleted old games and generated new games successfully."

UserStat.where('last_completed_date < ?', Date.today - 5).count

puts "Deleted old user stats"
