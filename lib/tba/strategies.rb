
Warden::Manager.before_failure do |env,opts|
  env['REQUEST_METHOD'] = "POST"
end

Warden::Strategies.add(:password) do

  def valid?
    params['email'] || params['password']
  end 

  def authenticate!
    a = Account.authenticate(params['email'], params['password'])
    a.nil? ? fail!("Could not log in") : success!(a)
  end 
  
end

