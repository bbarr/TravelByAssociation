if (typeof tba === 'undefined') {
  var tba = {};
}

tba.Trip = function(data) {
  
  Remotely.decorate(this);
  this.generate_crud('trips');

  this.locations = [];
  this.transits = [];
}

tba.Trip.prototype = {
  
  collapse: function() {
    return this;
  }
};

tba.Transit = function() {
  
	this.keys = [
		'start_date',
		'end_date',
		'means',
		'duration'
	];	
};

tba.Transit.prototype = {
   
}

tba.Needs = function() {

	this.keys = [
		'need',
		'solutions',
	];
};

tba.Needs.prototype = {

}

tba.Location = function() {
	
	this.keys = [
		'address',
		'lat',
		'lng',
		'start_date',
		'end_date'
	];
};

tba.Location.prototype = {
  
}

tba.Associate = function() {

}

tba.Associate.prototype = {
  
}