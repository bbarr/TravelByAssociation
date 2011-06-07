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
