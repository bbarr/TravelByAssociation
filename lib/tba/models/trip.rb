class Trip
  include MongoMapper::Document
  
  key :user_id, ObjectId
  key :title, String
  
  many :locations
  many :transits
  
  validates_presence_of :title
end