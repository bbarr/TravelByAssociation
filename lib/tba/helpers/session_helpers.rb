module SessionHelpers

  def current_account
    @current_account ||= env['warden'].user
  end
  
  def must_be_logged_in redirect_uri=nil
    unless current_account
      flash[:notice] = "Must be logged in"
      session[:redirected_from] = env['REQUEST_URI']
      redirect redirect_uri || "/login"
    end
  end
  
  def must_not_be_logged_in redirect_uri=nil
    if current_account
      flash[:notice] = "Must not be logged in"
      redirect redirect_uri || back
    end
  end
  
end