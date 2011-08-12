tba.app = Fugue.create('app', document.body, {

  trip: null,

  run: function() {
    this.publish('refresh');
  }
});

tba.itinerary = Fugue.create('itinerary', {
	
	events: {
	  'tba.app.refresh': 'refresh'
	},
	
	refresh: function() {

	}
	
});

tba.map = Fugue.create('map', {
	
	events: {
	  'tba.app.refresh': 'refresh'
	},
	
	refresh: function() {

	}
	
});

// start it up
tba.app.run();