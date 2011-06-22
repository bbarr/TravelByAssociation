tba.Associates = new Mote.Collection(function() {
	this.name = 'associates';
	this.keys = [
		'name'
	];
});

tba.Locations = new Mote.Collection(function() {
	
	this.name = 'locations';
	this.keys = [
		'address',
		'lat',
		'lng',
		'start_date',
		'end_date'
	];
	
	this.validate = function(loc) {
		
		var pass = true;
		
		if (!loc.data.address) {
			pass = false;
			this.errors['address'] = 'Requires Address';
		}
		
		return pass;
	},
	
	this.geocode = function() {
		var self = this;
		setTimeout(function() {
			self.publish('geocode_success', [ 70, 70 ]);
		}, 2000);
	}
});

tba.Transits = new Mote.Collection(function() {
	this.name = 'transits';
	this.keys = [
		'start_date',
		'end_date',
		'means',
		'duration'
	];
});

tba.Trips = new Mote.Collection(function() {
	
	this.plugin(Mote.EmbeddedDocuments);
	this.plugin(Mote.Remote, function(remote) {
		remote.request_config.base_uri = '/db';
	});

	this.name = 'trips';
	this.keys = [
		'name',
		'start_date',
		'start_location'
	];
	
	this.embeds_many(tba.Locations);
	this.embeds_many(tba.Transits);
	this.embeds_many(tba.Associates);
	
	this.generate_actions({
		fetch: 'GET /trips/:trip_id'
	});
});