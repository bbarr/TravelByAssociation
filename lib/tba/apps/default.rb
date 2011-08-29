class TBA::Default < TBA::Base

  get "/" do
    #@trip = { :name => 'my first trip!' }
    haml :index
  end
  
  post "/signup" do
    content_type :json
    user = User.new params
    if user.save
      { :message => 'Signup Success!' }.to_json
    else
      { :message => 'Sorry, signup failed', :user => user }.to_json
    end
  end
  
  post "/login" do
    content_type :json
    env['warden'].authenticate!
    [ 200, env['warden'].user.to_json ]
  end
  
  post "/logout" do
    content_type :json
    env['warden'].logout
    [ 200, { :message => 'Logged out' }.to_json ]
  end
  
  post "/unauthenticated" do
    content_type :json
    [ 401, { :message => 'Sorry, login failed', :detected => false }.to_json ]
  end
  
  get "/confirm_user" do
    content_type :json
    { :detected => !env['warden'].user.nil? }.to_json
  end
  
end