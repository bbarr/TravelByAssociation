tba.views = {};

tba.views.Map = Backbone.View.extend({

  el: '#map',
  
  events: {
    
  },
  
  initialize: function() {
    console.log(this);
  },
  
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

tba.views.Itinerary = Backbone.View.extend({
  
  el: '#itinerary',
  
  events: {},
  
  initialize: function() {}
});

tba.views.Location = Backbone.View.extend({
  
  tagName: 'li',
  
  events: {
    
  },
  
  render: function() {
    
  }
});

