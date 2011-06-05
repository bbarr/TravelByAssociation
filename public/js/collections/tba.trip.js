tba.Trips = Mote.Collection(function() {
	
	this.include(Mote.EmbeddedDocuments);
	
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

/*

{
	name: 'a trip',
	start_date: date object,
	start_location: address object,
	locations: [
		// location objects
	],
	transits: [
		// transit objects
	],
	associates: [
		// associate objects
	]
}

*/