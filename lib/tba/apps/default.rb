class TBA::Default < TBA::Base

  get "/" do
    haml :index
  end
  
end