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