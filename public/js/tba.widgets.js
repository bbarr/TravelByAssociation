
Fugue.state_toggler('loading', 'loaded');

tba.app = Fugue.create('app', document.body, {

	events: {
		'ready': 'refresh'
	},

	init: function() {
		tba.Trips.subscribe('fetch_success', this.set_current_trip, this);
	},
	
	set_current_trip: function(data) {
		tba.current_trip = new tba.Trips.Document(data);
		this.publish('ready');
	},
	
	refresh: function() {
		
		var hash = window.location.hash,
			id;
			
		if (hash) id = hash.substr(1);
		
		if (id) tba.Trips.fetch(id);
		else {
			tba.current_trip = new tba.Trips.Document;
			this.publish('ready');
		}
	}
	
});

tba.map = Fugue.create('map', {});

tba.itinerary = Fugue.create('itinerary', 'sidebar', {
	
	events: {
		'ready': 'refresh',
		'input blur': 'create_location'
	},
	
	init: function() {
		
		tba.Locations.subscribe('insert_success', function(loc) {
			self.form.removeClass('error');
			self.add(loc);
		});
		
		tba.Locations.subscribe('insert_error', function(loc, col) {
			self.form.addClass('error');
			tba.flash.error('There was an error while creating that location... Please try again');
		});
	},
	
	create_location: function(e) {

		var value = e.target.value, 

		if ( value === '' ) {
			this.form.removeClass('error');
			return;
		};
		
		new tba.Locations.Document({ address: value })
			.save();
	},

	add: function(location) {
		
		var html = tba.views.itinerary.location(location);
		
		this.form
			.before(html)
			.find('input').attr('value', '');
		
		this.generate_widget(html);
	},
	
	remove: function(location) {},
	
	refresh: function() {

		var trip = tba.current_trip,
			list = tba.views.itinerary.list(trip.data.locations);

		this.query('#itinerary').html(list);
		this._generate_widgets();
		this.form = this.$container.find('li').last();
	},
	
	generate_widget: function(html) {

		this.create(html.getAttribute('id'), {
			
			init: function() {
				
			}
		});
	},
	
	_generate_widgets: function() {
		
		var lis = this.query('#itinerary').find('li').not(':last-child'),
			self = this;
			
		lis.each(function(i, li) {
			self.generate_widget(li);
		});
	}
});

tba.itinerary._location_config = {
	
	init: function() {
		console.log('hi');
	}
}

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