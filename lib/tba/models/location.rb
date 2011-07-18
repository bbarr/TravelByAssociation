class Location
  include MongoMapper::EmbeddedDocument
  
  key :address, String
  key :lat, Float
  key :lng, Float
  key :start_date
  key :end_date
  
end