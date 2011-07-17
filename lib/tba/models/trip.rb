class Trip
  include MongoMapper::Document
  
  key :name, String, :required => true
  key :locations, Array
  key :transits, Array
  
  
end