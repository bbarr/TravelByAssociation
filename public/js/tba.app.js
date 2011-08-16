(function() {
  
  var App = Backbone.Router.extend({

    routes: {
      '': 'index',
      '/': 'index',
      '/trips/:id': 'trip'
    },

    index: function() {
      new tba.views.Map();
    },

    trip: function(id) {

    }

  });
  
  tba.app = new App;
  Backbone.history.start();
  
})();