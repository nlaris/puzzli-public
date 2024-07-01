#!/usr/bin/env ruby

require_relative '../config/environment'

Game.where('date < ?', Date.today - 1).destroy_all
Game.where('date > ?', Date.today + 10).destroy_all

GameCreator.create_games(Date.today, 10)

puts "Old games deleted and new games generated successfully."
