require "sinatra/base"
require "bundler"
Bundler.require

# namespace
module TBA; end

require File.join(File.dirname(__FILE__), "./strategies.rb")
require File.join(File.dirname(__FILE__), "./mote_extensions.rb")
Dir.glob(File.join(File.dirname(__FILE__), "./helpers/*.rb")) { |file| require file }
require File.join(File.dirname(__FILE__), "./apps/base.rb")
Dir.glob(File.join(File.dirname(__FILE__), "./apps/*.rb")) { |file| require file }
Dir.glob(File.join(File.dirname(__FILE__), "./models/*.rb")) { |file| require file }

# setup mote with mongoDB connection
if ENV['MONGOHQ_URL']
  db_name = URI.parse(ENV['MONGOHQ_URL']).path.gsub(/^\//, '')
  conn = Mongo::Connection.from_uri(ENV['MONGOHQ_URL'])
else
  db_name = 'tba'
  conn = Mongo::Connection.new
end

Mote.db = conn.db(db_name, :pk => Mote::PkFactory)