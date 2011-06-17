
Fugue.state_toggler('loading', 'loaded', 'is_loading');

tba.app = Fugue.create('app', document.body, {
	
	current_trip: null,
	
	init: function() {
		var self = this;
		tba.Trips.subscribe('fetch_success', function(data) {
			tba.current_trip = new tba.Trips.Document(data);
			self.publish('ready');
		});
	},
	
	ready: function() {
		this.refresh();
	},
	
	refresh: function() {
		var id = this.id_from_url();
		if (id) tba.Trips.fetch(id);
		else tba.app.current_trip = new tba.Trips.Document;
	},
	
	id_from_url: function() {
		var hash = window.location.hash;
		if (hash) return hash.substr(1);
	}
	
});

tba.map = Fugue.create('map', {});

tba.itinerary = Fugue.create('itinerary', {
	
	init: function() {
		
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

		// broken up to help cache "find"
		this
			.query(query + ' div')
			.html(msg);
	}
});