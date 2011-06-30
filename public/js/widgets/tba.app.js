// initial fugue settings
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
		else new tba.Trips.Document().save();
	}
	
});