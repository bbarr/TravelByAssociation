require "rake"
require "./lib/tba.rb"

task :seed do
  Account.create :email => 'email', :password => 'password'
end

task :truncate do
  Account.collection.drop
end
