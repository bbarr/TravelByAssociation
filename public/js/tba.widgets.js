Fugue.state_toggler('loading', 'loaded');

tba.app = Fugue.create('app', document.body, {

	events: {
		'ready': 'refresh'
	},

	init: function() {
		tba.Trips.subscribe('insert_success', this.update_current_trip, this);
	},
	
	update_current_trip: function() {
		tba.current_trip = tba.Trips.documents[0];
		this.publish('ready');
	},
	
	refresh: function() {

		var hash = window.location.hash,
		    id = (hash) ? hash.substr(1) : false;

		(id) ? tba.Trips.fetch(id) : new tba.Trips.Document().save();
	}
	
});

tba.map = Fugue.create('map', {});

tba.itinerary = Fugue.create('itinerary', 'sidebar', {
	
	events: {
		'app.ready': 'refresh',
		'input blur': 'create_location'
	},
	
	init: function() {
		tba.Locations.subscribe('save_success', this.add, this);
		tba.Locations.subscribe('save_error', this.error, this);
	},
	
	create_location: function(e) {

		var value = e.target.value, 

		if ( value === '' ) {
			this.form.removeClass('error');
			return;
		};
		
		new tba.Locations.Document({ address: value }).save();
	},

	error: function(loc, col) {
		self.form.addClass('error');
		tba.flash.error('There was an error while creating that location... Please try again');
	},

	add: function(location) {
		
		var html = tba.views.itinerary.location(location);
		
		this.form
			.before(html)
			.find('input').attr('value', '')
			.removeClass('error');
	},
	
	remove: function(location) {},
	
	refresh: function() {

		var trip = tba.current_trip,
			list = tba.views.itinerary.list(trip.data.locations);

		this.query('#itinerary').html(list);
		this.form = this.$container.find('li').last();
	}
});

tba.flash = Fugue.create('flash', {
	
	events: {
		'li click': function(e) {
			$(e.currentTarget).addClass('hide');
		},
		'app.ready': function(e) {
			this.notice('Welcome to Travel By Association! Plan your trip and get advice from people who probably care about you somehow.');
		}
	},

	notice: function(msg) {
		this.deliver('notice', msg);
	},

	error: function(msg) {
		this.deliver('error', msg);
	},

	deliver: function(type, msg) {

		var query = '.' + type;

		this
			.query(query)
			.removeClass('hide');

		// broken up to cache "find" call
		this
			.query(query + ' div')
			.html(msg);
	}
});