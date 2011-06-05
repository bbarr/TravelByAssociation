var tba = {
	controllers: {},
	models: {}
};

tba.scripts = [
	'lib/spine.js',
	'models/tba.trip.js',
	'models/tba.transit.js',
	'models/tba.location.js',
	'controllers/tba.c.main.js',
	'controllers/tba.c.itinerary.js'
];

// dynamically load everything we need... 
// will likely replace this with a "real" solution
(function() {
	
	var index = 0;
	var dequeue = function() {
		var uri = tba.scripts[index];
		if (!uri) {
			
		}
		index++;
		$.getScript(uri, dequeue);
	};
	dequeue();
	
})();