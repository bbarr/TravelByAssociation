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
	}
});

