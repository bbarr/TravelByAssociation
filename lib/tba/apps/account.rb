class TBA::Account < TBA::Base

  get "/" do
    must_be_logged_in
    haml :"account/index"
  end
  
  get '/login' do
    must_not_be_logged_in
    haml :"account/login"
  end
  
  post '/login' do
    must_not_be_logged_in
    env['warden'].authenticate!
    flash[:notice] = 'Logged in'
    redirect session.delete(:redirected_from) || "/dashboard"
  end
  
  post '/logout' do
    must_be_logged_in '/'
    env['warden'].logout(env['warden'].config.default_scope)
    flash[:notice] = 'Logged out'
    redirect "/"
  end

  get '/signup' do
    must_not_be_logged_in
    haml :'account/signup'
  end
  
  post '/signup' do
    must_not_be_logged_in

    account = Account.new params
    
    if account.save
      env['warden'].set_user(account)
      flash[:notice] = 'Account created'
      redirect '/dashboard'
    else
      flash[:error] = 'Sorry, unable to create account'
      redirect '/signup'
    end  
  end
  
  post '/unauthenticated' do
    status 410
    flash[:error] = "Sorry, unable to login. Please try again"
    haml :"account/login"
  end
end