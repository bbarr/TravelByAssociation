require "./lib/tba.rb"

use Rack::Session::Cookie
use Rack::Flash
use Rack::PostBodyContentTypeParser

use Warden::Manager do |manager|
	manager.default_strategies :password
	manager.failure_app = TBA::Default
	manager.serialize_into_session { |account| account.role }
	manager.serialize_from_session { |role| Account.new role }
end

map "/" do
	run TBA::Default
end

map "/trips" do
	run TBA::Trips
end