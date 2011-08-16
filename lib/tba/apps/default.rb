class TBA::Default < TBA::Base

  get "/" do
    #@trip = { :name => 'my first trip!' }
    haml :index
  end
  
end