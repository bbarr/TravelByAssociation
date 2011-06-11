tba.app = Fugue.create('app', document.body);

tba.app.extend({
	
	load: function(hash) {
		var test = new tba.Trips.Document();
		test.x = 'y';
		test.save();
		test.persist();
	},
	
	refresh: function() {
		
		var location = window.location,
			hash = location.hash;

		if (hash) {
			hash = hash.substr(1);
			var self = this;
			tba.Trips.fetch(hash, function(doc) {
				self.current_trip = doc;
				self.load(hash);
			});
		}
		
	}
});

tba.app.subscribe('app.ready', function() {
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
