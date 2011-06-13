
tba.app = Fugue.create('app', document.body, {

	ready: function() {
		this.refresh();
		tba.flash.notice('Welcome to Travel By Association! Plan your trip and get advice from people who probably care about you somehow.');
		this.publish('ready');
	}
});

tba.map = Fugue.create('map', {});

tba.itinerary = Fugue.create('itinerary', {});

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

		// broken up to help cache "find"
		this
			.query(query + ' div')
			.html(msg);
	}
});