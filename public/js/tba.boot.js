(function() {
  
  var app = new Backbone.Router, 
      account = new tba.models.Account;
  
  app.route('', 'index', function() {
    if (account.detected) {
      
    }
    else {
      prompt('login!');
    }
  });
  
  app.route('/trips/:id', 'trip', function(id) {
    
  });
  
  // always check for an active account first
  account.detect(function(detected) {
    this.detected = detected;
    // now that we know if there is a user, start our application
    Backbone.history.start();
  });
  
})();