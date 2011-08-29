(function() {
  
  var app = new Backbone.Router, 
      account = new tba.models.Account;
  
  app.route('', 'index', function() {
      
    if (account.get('detected')) {
      app.navigate('/trips/new', true);
    }
    else {
      
      new tba.views.Header({ model: account }).render();
      new tba.views.Map({ model: account });
      new tba.views.ObtrusiveOverlay( { type: 'Challenge',  model: account } ).open();
      
      account.bind_once('login', function() {
        app.navigate('/trips/new', true);
      });
    }
  });
  
  app.route('/trips/:id', 'trip', function(id) {
    
  });
  
  app.route('/trips/new', 'new_trip', function() {
    
    if (account.get('detected')) {  
      var new_trip = new tba.models.Trip;
      new tba.views.Itinerary({ model: new_trip }).render();
      
      account.bind_once('logout', function() {
        app.navigate('', true);
      });
    }
    else {
      app.navigate('', true);
    }
  });
  
  // always check for an active account first
  account.detect(function(detected) {
    account.set({ detected: detected });
    // now that we know if there is a user, start our application
    Backbone.history.start();
  });
})();