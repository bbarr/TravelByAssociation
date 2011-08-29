var tba = (function() {
  
  // extensions for backbone
  Backbone.View.prototype.mixin = function(src) {
    
    var events = src.events,
        initialize = src.initialize;
    
    delete src.events;
    delete src.initialize;
    
    _(this).extend(src);
    
    if (events) this.delegateEvents(events);
    if (initialize) initialize.call(this);
  };
  
  Backbone.Model.prototype.bind_once = function(name, cb, scope) {
    this.bind(name, function(data) {
      this.unbind(name);
      cb.call(scope, data);
    });
  }
  
  var collections, models, views, util;
  
  /** Models **/
  models = {};
  
  models.Account = Backbone.Model.extend({
    
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
  views.Header = Backbone.View.extend({
    
    el: 'header',
    
    events: {
      'click .logout': 'logout'
    },
    
    logout: function(e) {
      
      e.preventDefault();
      
      var self = this;
      
      $.ajax({
        url: '/logout',
        type: 'POST',
        success: function(response) {
          self.model.set({ detected: false });
          console.log(response)
        },
        error: function(response) {
          console.log(response)
        }
      });
    },
    
    update: function() {
      var logout = this.$el.find('.logout');
      this.model.get('detected') ? logout.removeClass('hide') : logout.addClass('hide');
    },
    
    render: function() {
      var html = Marker.render('header');
      this.el.appendChild(html);
      this.update();      
    },
    
    initialize: function() {
      this.$el = $(this.el);
      this.model.bind('change', this.update, this);
    }
  });
  
  views.Itinerary = Backbone.View.extend({
    el: '#itinerary',
    events: {},
    initialize: function(config) {
      this.mixin(new views.AbstractList('itinerary', this.model.locations));
      this.$el.removeClass('hide');
    }
  });
  
  views.AbstractList = function(name, collection) {  
    this.name = name;
    this.collection = collection;
    this.form_template = name + '_form';
    this.item_template = name + '_item';
  };
  
  views.AbstractList.prototype = {
    
    events: {
      'blur input': 'add_item',
      'click .remove': 'remove_item'
    },
    
    add_item: function(e) {
      var address = e.target.value;
      if (address === '') return;
      this.collection.add({ address: address });
    },
    
    remove_item: function(e) {
      e.preventDefault();
      var cid = $(e.target).parent('li').attr('id');
      this.collection.remove(cid);
    },
    
    added: function(item) {
      var item = Marker.render(this.item_template, item);
      this.$form.before(item);
      this.$form.find('input').val('');
    },
    
    removed: function(item) {
      $('#' + item.cid).remove();
    },
    
    errored: function(errors) {
      console.log(errors);
    },
      
    render: function() {
      var form = Marker.render(this.form_template);
      this.form = this.el.appendChild(form);
      this.$form = $(this.form);
    },
    
    initialize: function() {
      this.$el = $(this.el);
      this.collection.bind('add', this.added, this);
      this.collection.bind('error', this.errored, this);
      this.collection.bind('remove', this.removed, this);
    }
  };
  
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
      this.model.bind('change', this.render, this);
    }
  });
  
  views.Needs = Backbone.View.extend({});
  views.Need = Backbone.View.extend({});
  views.Suggestions = Backbone.View.extend({});
  views.Suggestion = Backbone.View.extend({});
  views.Associate = Backbone.View.extend({});
  
  views.ObtrusiveOverlay = Backbone.View.extend({
    
    _events: {
      'click .close': 'close'
    },
    
    template: 'obtrusive_overlay',

    initialize: function(data) {
      type = data.type || $.noop;
      this.el = Marker.render(this.template, type.toLowerCase());
      document.body.appendChild(this.el);
      this.$el = $(this.el);
      var sub_view = views[type];
      _(this).extend(sub_view);
      this.delegateEvents(this._events || {});
      if (this._initialize) this._initialize();
    },
    
    close: function() {
      this.$el.addClass('hide');
      views.ObtrusiveOverlay.$backdrop.addClass('hide');
    },
    
    open: function() {
      this.$el.removeClass('hide');
      views.ObtrusiveOverlay.$backdrop.removeClass('hide');
      this.center();
    },
    
    center: function() {
      
      var width = this.$el.width(),
          height = this.$el.height(),
          $d = $(document),
          d_width = $d.width(),
          d_height = $d.height();
          
      this.$el.css({
        left: d_width / 2,
        marginLeft: width / 2 * -1,
        top: d_height / 2,
        marginTop: height / 2 * -1
      });    
    }
  });
  views.ObtrusiveOverlay.$backdrop = $('#backdrop');
  
  views.Challenge = {
    
    _events: {
      'click h3': 'toggle',
      'click #login a': 'login',
      'click #signup a': 'signup'
    },
    
    toggle: function(e) {
      
      $(e.target)
        .parents('#challenge')
          .find('form')
            .removeClass('active')
          .end()
        .end()
        .parent('form')
          .addClass('active');
    },
    
    login: function(e) {
      
      e.preventDefault();
      
      var data = $(e.target).parent('form').serialize(),
          self = this;
          
      $.ajax({
        type: 'POST',
        url: '/login',
        data: data,
        success: function(response) {
          response.detected = true;
          self.model.set(response);
        },
        error: function(response) {
          self.model.set({ detected: false });
        }
      });
    },
    
    signup: function(e) {
      
      e.preventDefault();
      
      var data = $(e.target).parent('form').serialize();

      $.ajax({
        type: 'POST',
        url: '/signup',
        data: data,
        success: function(response) {
          console.log(response);
        },
        error: function(response) {
          console.log(response);
        }
      });
    }
  };
  
  /** Templates **/
  Marker.register('itinerary_form', function() {
    this
      .li()
        .label('Add location to trip...').end()
        .input({ type: 'text', placeholder: 'eg: Boston, MA' });
  });

  Marker.register('itinerary_item', function(item) {
    this
      .li({ id: item.cid })
        .text(item.get('address'))
        .a({ href: '#', 'class': 'remove' })
          .text('x')
  });
  
  Marker.register('obtrusive_overlay', function(content) {
    this
      .div({ className: 'overlay hide' })
        .a({ href: '#', className: 'close' }).end()
        .partial(content);
  });
  
  Marker.register('challenge', function() {
    
    var q = [ Math.floor(Math.random() * 11), Math.floor(Math.random() * 11) ];
        a = q[0] + q[1];

    this
      .div({ id: 'challenge' })
        .form({ id: 'login', className: 'active' })
          .h3('Log in').end()
          .input({ type: 'text', name: 'email', placeholder: 'Email Address' }).end()
          .input({ type: 'password', name: 'password', placeholder: 'Password' }).end()
          .a({ href: '#'})
            .text('Submit')
          .end()
        .end()
        .form({ id: 'signup' })
          .h3('...Or sign up').end()
          .input({ type: 'text', name: 'email', placeholder: 'Email Address' }).end()
          .input({ type: 'password', name: 'password', placeholder: 'Password'  }).end()
          .input({ type: 'password', name: 'confirm_password', placeholder: 'Confirm Password'  }).end()
          .input({ type: 'text', name: 'r_u_bot', placeholder: 'What is ' + q[0] + ' + ' + q[1] + '?' }).end()
          .input({ type: 'hidden', name: 'r_u_bot_a', value: a }).end()
          .a({ href: '#' })
            .text('Submit')
          .end()
        .end()
      .end();  
  });
  
  Marker.register('header', function() {
    this
      .nav()
        .a({ href: '#', className: 'logout' })
          .text('Logout')
        .end()
        .a({ href: '#', id: 'how_it_works', title: 'How it works' })
          .text('?')
        .end()
      .end()
      .h1('TravelByAssociation');
  });
  
  /** Utilities **/
  util = {};
  
  return {
    models: models,
    collections: collections,
    views: views,
    util: util
  }
})();