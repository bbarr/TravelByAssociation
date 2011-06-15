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
		remote.base_uri = '/db'; 
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
});