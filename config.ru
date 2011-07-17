require "./lib/tba.rb"

use Rack::Session::Cookie
use Rack::Flash
use Rack::PostBodyContentTypeParser

use Warden::Manager do |manager|
	manager.default_strategies :password
	manager.failure_app = TBA::Default
	manager.serialize_into_session { |account| account['_id'] }
	manager.serialize_from_session { |id| Account.find '_id' => id }
end

map "/" do
	run TBA::Default
end

map "/trips" do
	run TBA::Trips
end