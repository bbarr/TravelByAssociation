tba.app = Fugue.create('app', document.body);

tba.app.extend({
	
	load: function(hash) {
		this.current_trip.load(hash);
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
	
	this.current_trip = new tba.Trips.Document;

	this.refresh();
	
});
