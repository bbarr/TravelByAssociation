require "sinatra/base"
require "bundler"
require "rack/contrib" # doesnt seem to come with Bundler.require :-/
Bundler.require

# namespace
module TBA; end

require File.join(File.dirname(__FILE__), "./tba/strategies.rb")
Dir.glob(File.join(File.dirname(__FILE__), "./tba/helpers/*.rb")) { |file| require file }
require File.join(File.dirname(__FILE__), "./tba/apps/base.rb")
Dir.glob(File.join(File.dirname(__FILE__), "./tba/apps/*.rb")) { |file| require file }

if ENV['MONGOHQ_URL']
  db_name = URI.parse(ENV['MONGOHQ_URL']).path.gsub(/^\//, '')
  conn = Mongo::Connection.from_uri(ENV['MONGOHQ_URL'])
else
  db_name = 'tba'
  conn = Mongo::Connection.new
end

TBA::Database = conn.db(db_name)
