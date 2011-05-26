class TBA::Dashboard < TBA::Base
  
  get "/" do
    
    must_be_logged_in
    
    @trips = Trip.find
    @associates = Associate.find
    
    haml :"dashboard/index"
  end
  
end