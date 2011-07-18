class Account
  
  attr_accessor :role
  
  def initialize role=nil
    @role = role
  end
  
  def authenticate phrase, trip_id
    
    trip = Trip.find trip_id
    
    @role = 'admin' if trip.admin_phrase == phrase
    @role = 'associate' if trip.associate_phrase == phrase
    
    return @role.nil? ? nil : self
  end
end