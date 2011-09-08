(function() {

  var $body = $('body'),
      app = new Backbone.Router, 
      user = new tba.models.User,
      trip = user.get('trip'),
      challenge = new tba.views.Challenge({ model: user }),
      loading = new tba.views.Loading;

  // render global views
  new tba.views.Header({ model: user }).render();
  new tba.views.Map({ model: trip });
  new tba.views.Itinerary({ model: trip }).render();
  
  /**
   *  ROUTES
   */
  app.route('', 'index', function() {
    this.challenge = true;
    if (user.get('detected')) {
      app.navigate('/trips/new', true);
    }
  });

  app.route('/trips/:id', 'trip', function(id) {
    this.challenge = false;
  });

  app.route('/trips/new', 'new_trip', function() {
    this.challenge = false;    
    if (!user.get('detected')) {
      app.navigate('', true);
    }
    else {
      challenge.close();
    }
  });
  
  // start router/history
  Backbone.history.start();

  // app level login/logout updates
  user.bind('change:detected', function(user, detected) {
    $body.find('.admin')[ (detected ? 'remove' : 'add') + 'Class' ]('hide');
    app.navigate( (detected ? '/trips/new' : ''), true);
    if (app.challenge && detected === false) challenge.open();
  });
  
  // init by checking for user and starting router
  user.detect();
})();