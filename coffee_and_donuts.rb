
# coffee-and-donuts - coffee_and_donuts.rb
# Runs the backend server for Ruby Web App (using Sinatra), helps
# handle routes

require 'sinatra'
require 'sinatra/reloader' if development?

set :public_folder => "public", :static => true

class CoffeeAndDonuts < Sinatra::Base

end

get "/" do
    erb :welcome
end