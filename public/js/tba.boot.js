(function() {

  var $body = $('body'),
      app = new Backbone.Router, 
      user = new tba.models.User,
      trip = user.get('trip');

  // render global views
  new tba.views.Header({ model: user }).render();
  new tba.views.Map({ model: trip });
  new tba.views.Itinerary({ model: trip }).render();
  new tba.views.Challenge({ model: user });
  new tba.views.Loading({ model: app });

  /**
   *  ROUTES
   */
  app.route('', 'index', function() {
    if ( !user.get('detected') ) user.trigger('prompt')
  });

  app.route('/trips/:id', 'trip', function(id) {
    
  });

  user.bind('processing', function() {
    app.trigger('loading');
  }, app);
  
  user.bind('processed', function() {
    app.trigger('loaded');
  }, app);
  
  // app level login/logout updates
  user.bind('change:detected', function(user, detected) {
    $body.find('.admin')[ (detected ? 'remove' : 'add') + 'Class' ]('hide');
    user.trigger('processed');
    if (detected) {
      
    }
  });
  
  // init by checking for user and starting router
  user.detect(function() {
    // start router/history
    Backbone.history.start();
  });

})();