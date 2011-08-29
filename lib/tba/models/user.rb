class User
  include MongoMapper::Document
  
  key :email
  key :password
  
  def self.authenticate email, password
    User.first({ :email => email, :password => password })
  end
  
end