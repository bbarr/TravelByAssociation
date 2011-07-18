class TBA::Default < TBA::Base

  get "/" do
    haml :"trips/show"
  end
  
end