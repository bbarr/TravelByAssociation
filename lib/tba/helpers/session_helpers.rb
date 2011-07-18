module SessionHelpers

  def current_account
    @current_account ||= env['warden'].user
  end
  
  def must_be_someone
    unless current_account
      
    end
  end
  
  def must_be_admin
    unless current_account or current_account.admin.nil?
      'no dice - must be admin'
    end
  end
  
  def must_be_noone
    if current_account
      'no dice - must not be logged in'
    end
  end
end