class Trip
  include MongoMapper::Document
  
  key :user_id, ObjectId
  key :title, String
  key :admin_phrase, String
  key :associate_phrase, String
  
  many :locations
  many :transits
  
  validates_presence_of :title
end