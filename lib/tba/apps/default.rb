class TBA::Default < TBA::Base

  get "/" do
    haml :"default/index"
  end
  
end