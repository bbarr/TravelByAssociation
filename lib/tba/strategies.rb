Warden::Manager.before_failure do |env, opts|
  #env['REQUEST_METHOD'] = "POST"
end

Warden::Strategies.add(:openid) do
  def authenticate!
    if resp = env["rack.openid.response"]
      case resp.status
      when :success
        u = User.find_by_identity_url(resp.identity_url)
        success!(u)
      when :cancel
        fail!("OpenID auth cancelled")
      when :failure
        fail!("OpenID auth failed")
      end
    else
      custom!([401, {"WWW-Authenticate" => 'OpenID identifier="https://www.google.com/accounts/o8/id"'}, "OpenID plz"])
    end
  end
end

Warden::Strategies.add(:password) do
  
  def valid?
    params['phrase']
  end
  
  def authenticate!
    a = Account.new params['phrase'], params['trip_id']
    a.nil? ? fail!('Could not log in') : success!(a)
  end
end

