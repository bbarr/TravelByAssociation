class Account < Mote::Document
  include Mote::Keys
  
  key :email
  key :password
  
  def self.authenticate email, password
    Account.find_one 'email' => email, 'password' => password
  end
  
end