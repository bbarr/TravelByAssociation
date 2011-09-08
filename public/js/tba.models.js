tba.models = (function() {
  
  var models = {};

  models.User = Backbone.Model.extend({
  
    defaults: {
      email: '',
      trips: []
    },
  
    detect: function(cb) {
      $.ajax({
        type: 'GET',
        url: '/confirm_user',
        success: function(result) {
          cb(result.detected);
        }
      });
    }
  });

  models.Trip = Backbone.Model.extend({
  
    initialize: function() {
      this.locations = new collections.Locations;
      this.transits = new collections.Transits;
    }
  });

  models.Location = Backbone.Model.extend({
  
    geocoder: new google.maps.Geocoder,
  
    geocode: function(address) {

      var self = this;
      address = address ||this.get('address');

      this.geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
        
          var location = results[0].geometry.location;
        
          self.set({ 
            lat: location.lat(),
            lng: location.lng(),
            formatted_address: results[0].formatted_address
          });
        
          self.collection.add(self);
        } 
        else {
         console.log('error while geocoding');
        }
      });
    },
  
    validate: function(attrs) {
    
      // 'silent' means internal error.. no user feedback needed
      if (!attrs.formatted_address) {
        return 'silent';
      }      
    },
  
    initialize: function() {
      this.needs = new collections.Needs;
      this.suggestions = new collections.Suggestions;
      this.geocode();
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

  tba.models = models;
});