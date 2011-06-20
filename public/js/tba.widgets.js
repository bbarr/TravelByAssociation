
Fugue.state_toggler('loading', 'loaded', 'is_loading');

tba.app = Fugue.create('app', document.body, {
	
	init: function() {
		var self = this;
		tba.Trips.subscribe('fetch_success', function(data) {
			tba.current_trip = new tba.Trips.Document(data);
			self.publish('ready');
		});
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
		'app.ready': 'refresh'
	},
	
	init: function() {
		this
			.query('.entry')
			.bind('dragstart', function(e) {
				var dt = e.originalEvent.dataTransfer;
				dt.setData('Text', 'hi');
				dt.effectAllowed = 'move';
				console.log('start')
			})
			.bind('dragend', function(e) {
				e.stopPropagation();
				e.preventDefault();		
				return false;
			});
		
		this
			.query('#itinerary')
			.bind('dragover', function(e) {
				return false;
			})
			.bind('dragenter', function(e) {
				$(this).css({ border: '1px solid red'})
				return false;
			})
			.bind('dragleave', function(e) {
				$(this).css({ border: '1px solid #aaa'})				
				return false;
			})
			.bind('drop', function(e) {
				var dt = e.originalEvent.dataTransfer;
				$(this).css({ border: '1px solid #aaa'})
				console.log(dt)
				return false;
			});
	},
	
	refresh: function() {
		
		var trip = tba.current_trip,
			list = tba.views.itinerary.list(trip.data.locations);

		this.$container.find('#itinerary').html(list);
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