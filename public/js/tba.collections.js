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
	
	this.validate = function(doc) {
		
		var pass = true;
		
		if (!doc.data.address) {
			pass = false;
			this.errors['address'] = 'Requires Address';
		}
		
		return pass;
	},

	this.geocode = function(address) {
		
	},

	this.subscribe('before_save', function(doc) {

		if (doc.data.lat && doc.data.lng) return;		

		this.waiting = true;
		this.subscribe('geocoded', function(loc) {
			
		});
		
		this.geocode(doc.data.address);
	});
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
		remote.action_config.base_uri = '/db';
	});
	
	this.cap_size = 1;
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

	this.subscribe('fetch_success', function(data) {
		var doc = new this.Document(data);
		this.insert(doc);
	});
});