require "sinatra/base"
require "bundler"
Bundler.require

# namespace
module TBA; end

require File.join(File.dirname(__FILE__), "./tba/strategies.rb")
Dir.glob(File.join(File.dirname(__FILE__), "./tba/helpers/*.rb")) { |file| require file }
require File.join(File.dirname(__FILE__), "./tba/apps/base.rb")
Dir.glob(File.join(File.dirname(__FILE__), "./tba/apps/*.rb")) { |file| require file }