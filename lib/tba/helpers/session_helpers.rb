module SessionHelpers

  def current_account
    @current_account ||= env['warden'].user
  end
  
  def must_be_someone redirect_uri=nil
    unless current_account
      flash[:notice] = "Must be logged in"
      session[:redirected_from] = env['REQUEST_URI']
      redirect redirect_uri || "/login"
    end
  end
  
  def must_be_admin redirect_uri=nil
    if current_account
      flash[:notice] = "Must not be logged in"
      redirect redirect_uri || back
    end
  end
  
  def must_be_noone redirect_uri=nil

  end
  
end