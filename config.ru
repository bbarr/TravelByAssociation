require "./lib/tba.rb"

use Rack::Session::Cookie
use Rack::PostBodyContentTypeParser

map "/" do
	run TBA::Default
end

map "/trips" do
	run TBA::Trips
end