
var tba = {};

(function() {

	var index = 0,
		scripts = [
			'lib/jquery.js',
			'lib/jquery.build.js',
			'lib/mote.js',
			'lib/remotely.js',
			'lib/fugue.js',
			'models/tba.needs.js',
			'models/tba.associates.js',
			'models/tba.locations.js',
			'models/tba.transits.js',
			'models/tba.trips.js',
			'widgets/tba.app.js',
			'widgets/tba.itinerary.js',
			'widgets/tba.map.js',
			'widgets/tba.overlays.js',
			'tba.views.js'
		],
		dequeue = function() {
			
			var uri = scripts[index];
			if (!uri) {			  
				tba.app.refresh();
				return;
			}

			index++;
			$.getScript('/js/' + uri, dequeue);
		};

	// go!
	$(dequeue);

})();