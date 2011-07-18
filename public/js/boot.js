
var tba = {};

(function() {
  
  if (!document.getElementById('itinerary')) return;
  
	var index = 0,
		scripts = [
			'lib/jquery.js',
			'lib/jquery.build.js',
			'lib/remotely.js',
			'lib/fugue.js',
			'lib/scribe.js',			
			'models/tba.need.js',
			'models/tba.associate.js',
			'models/tba.location.js',
			'models/tba.transit.js',
			'models/tba.trip.js',
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