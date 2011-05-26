class Mote::Document
  
  def self.find_by_id id
    self.find_one( { '_id' => id } )
  end
  
  def get_id subject
    return subject if subject.is_a? BSON::ObjectId
    return subject['_id'] unless subject['_id'].nil?
  end
  
end