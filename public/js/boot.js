var tba = {};

// dynamically load everything we need... 
// will likely replace this with a "real" solution
(function() {

	var index = 0,
		scripts = [
			'lib/mote.js',
			'lib/fugue.js',
			'tba.app.js',
			'mote.rest.js',
			'widgets/tba.map.js',
			'widgets/tba.itinerary.js',
			'widgets/tba.flash.js',
			'collections/tba.transits.js',
			'collections/tba.locations.js',
			'collections/tba.associates.js',
			'collections/tba.trips.js'
		],
		dequeue = function() {
			
			var uri = scripts[index];
			if (!uri) {
				tba.app.publish('ready');
				return;
			}

			index++;
			$.getScript('/js/' + uri, dequeue);
		};

	// go!
	$(dequeue);

})();