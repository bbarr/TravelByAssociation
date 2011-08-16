var tba = (function() {
  
  var App, collections, models, views, templates, util;
  
  /** Application **/
  App = Backbone.Router.extend({
    
    routes: {
      '': 'index',
      '/trips/:id': 'trip'
    },
    
    index: function() {
      
      var self = this;
      
      this.account.validate(function() {
        
        var _id = self.account.trips.first().get('_id');
        
        self.navigate('/trips/' + _id);
        
      }, function() {
        
        new views.Prompt().render();
      });
    },
    
    trip: function(id) {
      
      var self = this;
      
      this.account.validate(function() {
        
      }, function() {
        
      });
    },
    
    initialize: function() {
      this.account = new models.Account();
    }
  });
  
  /** Models **/
  models = {};
  
  models.Trip = Backbone.Model.extend({
    
    initialize: function() {
      this.locations = new collections.Locations;
      this.transits = new collections.Transits;
    }
  });
  
  models.Location = Backbone.Model.extend({
    
    initialize: function() {
      this.needs = new collections.Needs;
      this.suggestions = new collections.Suggestions;
    }
  });
  
  models.Transit = Backbone.Model.extend({
    
    initialize: function() {
      this.needs = new collections.Needs;
      this.suggestion = new collections.Suggestions;
    }
  });
  
  models.Need = Backbone.Model.extend({});
  models.Suggestion = Backbone.Model.extend({});
  models.Associate = Backbone.Model.extend({});
  
  /** Collections **/
  collections = {};
  
  collections.Trips = Backbone.Collection.extend({
    model: models.Trip
  });
  
  collections.Locations = Backbone.Collection.extend({
    model: models.Location
  });
  
  collections.Transits = Backbone.Collection.extend({
    model: models.Transit
  });
  
  collections.Needs = Backbone.Collection.extend({
    model: models.Need
  });
  
  collections.Suggestions = Backbone.Collection.extend({
    model: models.Suggestion
  });
  
  /** Views **/
  views = {};
  views.Itinerary = Backbone.View.extend({});
  views.Location = Backbone.View.extend({});
  views.Transit = Backbone.View.extend({});
  views.Admin = Backbone.View.extend({});
  
  views.Map = Backbone.View.extend({
    
    el: '#map',
    
    defaults: {
      zoom: 8,
      center: new google.maps.LatLng(-34.397, 150.644),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    },
    
    initialize: function() {
      this.gm = new google.maps.Map(this.el, this.defaults);
      //this.model.bind('change', this.render, this);
    }
  });
  
  views.Needs = Backbone.View.extend({});
  views.Need = Backbone.View.extend({});
  views.Suggestions = Backbone.View.extend({});
  views.Suggestion = Backbone.View.extend({});
  views.Associate = Backbone.View.extend({});
  
  /** Templates **/
  Marker.register('itinerary_form', function() {
    this
      .li()
        .label('Add location to trip...').end()
        .input({ type: 'text', placeholder: 'eg: Boston, MA' });
  });

  Marker.register('itinerary_item', function(content) {
    this
      .li()
        .text(content)
        .a({ href: '#', 'class': 'remove' })
          .text('x')
  });
  
  /** Utilities **/
  util = {};
  
  return {
    App: App,
    models: models,
    views: views,
    util: util
  }
})();