# All apps inheret from this class

class TBA::Base < Sinatra::Base

  set :static, true
  set :public, File.join(File.dirname(__FILE__), '../../public/')
  
  helpers ViewHelpers
  helpers SessionHelpers
    
end
