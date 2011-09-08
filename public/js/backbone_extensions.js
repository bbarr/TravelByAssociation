// extensions for backbone
_.extend(Backbone.Model.prototype, {
  // Version of toJSON that traverses nested models
  deepToJSON: function() {
    var obj = this.toJSON();
    _.each(_.keys(obj), function(key) {
      if (_.isFunction(obj[key].deepToJSON)) {
        obj[key] = obj[key].deepToJSON();
      }
    });
    return obj;
  }
});

_.extend(Backbone.Collection.prototype, {
  // Version of toJSON that traverses nested models
  deepToJSON: function() {
    return this.models.map(function(model){ return model.deepToJSON(); });
  }
});

Backbone.Model.prototype.bind_once = function(name, cb, scope) {
  this.bind(name, function(data) {
    this.unbind(name);
    cb.call(scope || this, data);
  });
}