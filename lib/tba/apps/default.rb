class TBA::Default < TBA::Base

  get "/" do
    haml :"trips/new"
  end
  
end