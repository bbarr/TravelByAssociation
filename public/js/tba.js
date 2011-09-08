
var tba = {
  models: {},
  collections: {},
  views: {}
};

tba.models.User = Backbone.Model.extend({
    
  logout: function(data) {
    var self = this;
    
    $.ajax({
      url: '/logout',
      type: 'POST',
      success: function(response) {
        self.set({ detected: false });
      },
      error: function(response) {}
    });
  },
  
  login: function(data) {
    var self = this;
      
    $.ajax({
      type: 'POST',
      url: '/login',
      data: data,
      success: function(response) {
        response.detected = true;
        self.set(response);   
      },
      error: function(response) {
        self.set({ detected: true },  { silent: true })
        self.set({ detected: false });
      }
    });
  },

  signup: function(data) {
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
  },
  
  initialize: function() {
    this.set({ trip: new tba.models.Trip });
  },

  detect: function() {
    var self = this;
    this.set({ detected: 0 })
    $.ajax({
      type: 'GET',
      url: '/confirm_user',
      success: function(result) {
        self.set({ detected: result.detected });
      }
    });
  }
});

tba.models.Trip = Backbone.Model.extend({
  
  initialize: function() {
    this.set({ locations: new tba.collections.Locations });
    this.set({ transits: new tba.collections.Transits });
  }
});

tba.models.Location = Backbone.Model.extend({

  geocoder: new google.maps.Geocoder,

  geocode: function() {

    var self = this;
    address = this.get('address');

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
    if (attrs.address && !attrs.formatted_address) {
      return 'silent';
    }      
  },

  initialize: function() {
    this.set({ needs: new tba.collections.Needs });
    this.set({ suggestions: new tba.collections.Suggestions });
    this.geocode();
  }
});

tba.models.Transit = Backbone.Model.extend({
  
});

tba.collections.Locations = Backbone.Collection.extend({
  model: tba.models.Location
});

tba.collections.Transits = Backbone.Collection.extend({
  model: tba.models.Transit
});

tba.collections.Needs = Backbone.Collection.extend({
  model: tba.models.Need
});

tba.collections.Suggestions = Backbone.Collection.extend({
  model: tba.models.Suggestion
});

tba.views.Header = Backbone.View.extend({

  el: 'header',

  events: {
    'click .logout': 'logout'
  },
  
  logout: function(e) {
    e.preventDefault();
    this.model.logout();
  },

  render: function() {
    var html = Marker.render('header');
    this.el.appendChild(html);
  }
});

tba.views.Itinerary = Backbone.View.extend({
  el: '#itinerary',
  events: {},
  render: function() {
    this.render_list();
  },
  initialize: function(config) {
    this.mixin(new tba.views.AbstractList('itinerary', 'address', this.model.get('locations')));
    this.$el.parents('sidebar:first').removeClass('hide');
  }
});

tba.views.AbstractList = function(name, attr, collection) {
  this.name = name;
  this.attr = attr;
  this.collection = collection;
  this.form_template = name + '_form';
  this.item_template = name + '_item';
};

tba.views.AbstractList.prototype = {

  events: {
    'blur input': 'add_item',
    'click .remove': 'remove_item'
  },

  add_item: function(e) {
    var input = e.target.value;
    if (input === '') return;
    var item = {};
    item[this.attr] = input;
    this.collection.add(item);
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
  
  render_list: function() {
    var form = Marker.render(this.form_template);
    this.form = this.el.appendChild(form);
    this.$form = $(this.form);
    return this.el;
  },

  initialize: function() {
    this.collection.bind('add', this.added, this);
    this.collection.bind('error', this.errored, this);
    this.collection.bind('remove', this.removed, this);
  }
};

tba.views.Map = Backbone.View.extend({

  el: '#map',

  defaults: {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
  },

  locations: {},

  zoom_to_all: function() {
  
    var bounds = new google.maps.LatLngBounds;

    _(this.locations).each(function(location) {
      bounds.extend(location.marker.position);
      location.overlay.close();
    });

    this.gm.setOptions({ maxZoom: this.defaults.zoom });
    this.gm.fitBounds(bounds);
    this.gm.setOptions({ maxZoom: null });
  },

  add: function(loc) {

    var position = new google.maps.LatLng(loc.get('lat'), loc.get('lng')),
        marker = new google.maps.Marker({ position: position }),
        overlay = new google.maps.InfoWindow({ content: new tba.views.LocationOverlay({ model: loc }).render() }),
        location;
  
    marker.setMap(this.gm);
  
    location = this.locations[loc.cid] = {
      marker: marker,
      overlay: overlay
    };
  
    this.bind(location);
  
    this.zoom_to_all();
  },

  remove: function(loc) {
    var marker = this.locations[loc.cid].marker;
    marker.setMap(null);
    this.zoom_to_all();
  },

  bind: function(location) {
    google.maps.event.addListener(location.marker, 'click', function() {
      location.overlay.open(location.marker.getMap(), location.marker);
    });
  },

  initialize: function() {
    var locations = this.model.get('locations');
    this.gm = new google.maps.Map(this.el, this.defaults);
    locations.bind('add', this.add, this);
    locations.bind('remove', this.remove, this);
  }
});

tba.views.Needs = Backbone.View.extend({

  initialize: function() {
    this.mixin(new tba.views.AbstractList('needs', 'text', this.collection));
  },

  render: function() {
    this.render_list();
  }
});

tba.views.ObtrusiveOverlay = function(content) {
  this.content = content;
};

tba.views.ObtrusiveOverlay.prototype = {

  $backdrop: $('#backdrop'),

  events: {
    'click .close': 'close'
  },

  template: 'obtrusive_overlay',

  initialize: function() {
    this.el = Marker.render(this.template, this.content);
    document.body.appendChild(this.el);    
    this.$el = $(this.el);
  },

  close: function() {
    tba.views.ObtrusiveOverlay.active--;
    this.$el.addClass('hide');
    if (!tba.views.ObtrusiveOverlay.active) {
      this.$backdrop.addClass('hide');
    }
  },

  open: function() {
    tba.views.ObtrusiveOverlay.active++;
    this.$el.removeClass('hide');
    this.$backdrop.removeClass('hide');
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
};

tba.views.ObtrusiveOverlay.active = 0;

tba.views.Challenge = Backbone.View.extend({

  events: {
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
  
  signup: function(e) {
    e.preventDefault();
    this.close();
    var data = $(e.target).parent('form').serialize();
    this.model.signup(data);
  },
  
  login: function(e) {
    e.preventDefault();
    this.close();    
    var data = $(e.target).parent('form').serialize();
    this.model.login(data);
  },

  initialize: function() {
    var self = this;    
    this.mixin(new tba.views.ObtrusiveOverlay('challenge'));
    this.delegateEvents(this.events);
  }
});

tba.views.Loading = Backbone.View.extend({
  
  initialize: function() {
    var self = this;    
    this.mixin(new tba.views.ObtrusiveOverlay('loading'));
    this.$el.ajaxStart(function() { self.open(); });
    this.$el.ajaxStop(function() { self.close(); });
  }
});

tba.views.LocationOverlay = Backbone.View.extend({

  initialize: function() {
    
  },

  render: function() {
  
    var overlay = Marker.render('location_overlay', this.model),
        $overlay = $(overlay);

    this.needs = new tba.views.Needs({ collection: this.model.get('needs'), el: $overlay.find('.needs')[0] });
    this.suggestions = new tba.views.Suggestions({ collection: this.model.get('suggestions'), el: $overlay.find('.suggestions')[0] });

    this.needs.render();
    this.suggestions.render();

    return overlay;
  }
});

tba.views.Suggestions = Backbone.View.extend({

  render: function() {
    var html = Marker.render('suggestions');
    this.el.appendChild(html);
  }
});

Marker.register('itinerary_form', function() {
  this
    .li({ className: 'admin' })
      .label('Add location to trip...').end()
      .input({ type: 'text', placeholder: 'eg: Boston, MA' });
});

Marker.register('itinerary_item', function(item) {
  this
    .li({ id: item.cid })
      .text(item.get('formatted_address'))
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
      .a({ href: '#', className: 'admin logout' })
        .text('Logout')
      .end()
      .a({ href: '#', id: 'how_it_works', title: 'How it works' })
        .text('?')
      .end()
    .end()
    .h1('TravelByAssociation');
});

Marker.register('location_overlay', function(loc) {

  this
    .div({ className: 'location_overlay' })
      .ul({ className: 'needs' }).end()
      .div({ className: 'suggestions' })

});

Marker.register('needs_form', function() {
  this
    .li()
      .label('Add need').end()
      .input({ type: 'text', placeholder: 'eg: A couch to crash on...' });
});

Marker.register('needs_item', function(item) {
  this
    .li({ id: item.cid })
      .text(item.get('text'))
      .a({ href: '#', 'class': 'remove' })
        .text('x')
});

Marker.register('suggestions', function() {

  this.div('suggestions');
});

Marker.register('loading', function() {
  
  this
    .div({ className: 'loading' })
      .text('Loading...');
});

// extensions
Backbone.View.prototype.mixin = function(src) {
  
  var _black_list = _([ 'events', 'initialize' ]),
      stripped_src = {},
      key;
  
  for (key in src) {
    if (!_black_list.include(key)) stripped_src[key] = src[key];
  }
  
  _(this).extend(stripped_src);
  
  if (src.events) this.delegateEvents(src.events);
  if (src.initialize) src.initialize.call(this);
};