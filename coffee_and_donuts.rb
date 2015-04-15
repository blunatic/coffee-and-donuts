
# coffee-and-donuts - coffee_and_donuts.rb
# Runs the backend server for Ruby Web App (using Sinatra), helps
# handle routes

require 'sinatra'

get '/' do
    erb :welcome
end