var tba = (function() {
  
  var App, models, views, util;
  
  /** Application **/
  App = Backbone.Router.extend({
    
    routes: {
      '': 'index',
      '/trip/:id': 'trip'
    },
    
    index: function() {
      
    },
    
    trip: function(id) {
      
    },
    
    initialize: function() {
      this.map = new views.Map;
      this.itinerary = new views.Itinerary;
    }
  });
  
  /** Models **/
  models = {};
  models.Trip = Backbone.Model.extend({});
  models.Location = Backbone.Model.extend({});
  models.Transit = Backbone.Model.extend({});
  models.Need = Backbone.Model.extend({});
  models.Suggestion = Backbone.Model.extend({});
  models.Associate = Backbone.Model.extend({});
  
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
    
    render: function() {
      this.map = new google.maps.Map(this.el, this.defaults);
    }
  });
  
  views.Needs = Backbone.View.extend({});
  views.Need = Backbone.View.extend({});
  views.Suggestions = Backbone.View.extend({});
  views.Suggestion = Backbone.View.extend({});
  views.Associate = Backbone.View.extend({});
  
  /** Utilities **/
  util = {};
  
  return {
    App: App,
    models: models,
    views: views,
    util: util
  }
})();