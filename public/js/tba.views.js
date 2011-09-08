tba.views = (function() {
  
  var views = {};
  
  


  views.Location = Backbone.View.extend({});
  views.Transit = Backbone.View.extend({});
  views.Admin = Backbone.View.extend({});

  



  views.Need = Backbone.View.extend({});
  views.Suggestions = Backbone.View.extend({
  
    render: function() {
      var html = Marker.render('suggestions');
      this.el.appendChild(html);
    }
  });
  views.Suggestion = Backbone.View.extend({});
  views.Associate = Backbone.View.extend({});

  
  
  tba.views = views;
});