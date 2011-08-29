Warden::Strategies.add(:password) do
  
  def valid?
    params['email'] and params['password']
  end
  
  def authenticate!
    user = User.authenticate(params['email'], params['password'])
    user.nil? ? fail!('Could not log in') : success!(user)
  end
  
end