tba.modules = {};

tba.modules.app = Fugue.create('app', document.body, {

  trip: null,

  run: function() {
    this.publish('refresh');
  }
});

tba.modules.header = Fugue.create('header', 'header',{
  
  events: {
    'tba.modules.app.refresh': 'refresh',
    '.logout click': 'logout',
    '#how_it_works click': 'help'
  },
  
  init: function() {
    
  },
  
  refresh: function() {
    
  },
  
  logout: function(e) {
    e.preventDefault();
    alert('logged out');
  },

  help: function(e) {
    e.preventDefault();
    alert('showing some help');
  }

});

tba.modules.itinerary = Fugue.create('itinerary', {

	events: {
	  'tba.modules.app.refresh': 'refresh',
	  '.toggle a click': 'toggle'
	},

  init: function() {
    this.list = new tba.List('itinerary', this.query('ul')[0]);
  },

	refresh: function(e) {
    
	},

	toggle: function(e) {
	  e.preventDefault();
    this.$container.toggleClass('hidden');
	}

});

tba.modules.map = Fugue.create('map', {
	
	events: {
	  'tba.modules.app.refresh': 'refresh'
	},

	refresh: function() {
	  new google.maps.Map(this.$container[0], tba.MAP_DEFAULTS);
	}
	
});

// start it up
tba.modules.app.run();