Fugue.state_toggler('loading', 'loaded');

tba.app = Fugue.create('app', document.body, {

	events: {
		'ready': 'refresh'
	},

	init: function() {
		tba.Trips.subscribe('change.insert', function(data) {
			tba.current_trip = tba.Trips.documents[0];
			this.publish('ready');
		}, this);
	},
	
	refresh: function() {

		var hash = window.location.hash,
		    id = (hash) ? hash.substr(1) : false;
		
		if (id) tba.Trips.fetch(id);
		else {
			new tba.Trips.Document().save();
			tba.flash.notice('Welcome to Travel By Association!');
		}
	}
	
});

tba.map = Fugue.create('map', {});

tba.itinerary = Fugue.create('itinerary', 'sidebar', {
	
	events: {
		'app.ready': 'refresh',
		'input blur': 'create_location'
	},
	
	init: function() {
		tba.Locations.subscribe('change.insert', this.add, this);
		tba.Locations.subscribe('error.insert', this.error, this);
	},
	
	create_location: function(e) {

		var value = e.target.value, 
		if ( value === '' ) return;
		
		this.form.removeClass('error');
		new tba.Locations.Document({ address: value }).save();
	},

	error: function(errors) {
		this.form.addClass('error');
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