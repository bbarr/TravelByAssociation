tba.app = Fugue.create('app', document.body);

tba.app.extend({
	
	load: function(hash) {
		this.current_trip.x = 'y';
		tba.Trips.save(this.current_trip);
		tba.Trips.remote.persist(this.current_trip);
		this.current_trip.hell = 'yea';
		tba.Trips.save(this.current_trip);
		tba.Trips.remote.persist(this.current_trip);
	},
	
	refresh: function() {
		
		var location = window.location,
			hash = location.hash;

		if (hash) {
			hash = hash.substr(1);
			this.load(hash);
		}
		
	}
});

tba.app.subscribe('app.ready', function() {
	this.current_trip = {};
	this.refresh();
});

tba.map = Fugue.create('map');

tba.flash = Fugue.create('flash');

tba.flash.extend({

	message: function(type, msg) {

		var query = '.' + type;
		
		this
			.$container
			.find(query)
			.removeClass('hide');
		
		// broken up to help cache "find" calls
		this
			.find(query + ' div')
			.html(msg);
	},

	notice: function(msg) {
		this.message('notice', msg);
	},
	
	error: function(msg) {
		this.message('error', msg);
	}
	
});

tba.flash.execute(function() {
	
	this.subscribe('app.ready', function() {
		this.notice('Welcome to Travel By Association! Plan your trip and get advice from people who probably care about you somehow.');
	});
	
	this.delegate('li', 'click', function(e) {
		$(e.currentTarget).addClass('hide');
	});
});

tba.itinerary = Fugue.create('itinerary');
