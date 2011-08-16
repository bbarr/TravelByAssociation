tba.models = {};

tba.models.Trip = Backbone.Model.extend({
  
  initialize: function() {
    
  },
  
  defaults: {
    title: '',
    locations: [],
    transits: []
  }
});
