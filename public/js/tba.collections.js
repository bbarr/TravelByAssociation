tba.collections = (function() {
  
  var collections = {},
      models = tba.models;
  
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
  
  return collections;
});