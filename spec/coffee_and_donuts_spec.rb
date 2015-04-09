require_relative "spec_helper"
require_relative "../coffee_and_donuts.rb"

def app
  CoffeeAndDonuts
end

describe CoffeeAndDonuts do
  it "responds with a welcome message" do
    get '/'

    last_response.body.must_include 'Welcome to the Sinatra Template!'
  end
end
