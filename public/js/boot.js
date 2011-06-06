// dynamically load everything we need... 
// will likely replace this with a "real" solution
(function() {

	var index = 0,
		scripts = [
			'tba.app.js',
			'lib/mote/src/mote.js',
			'lib/fugue/fugue.js',
			'collections/tba.transits.js',
			'collections/tba.locations.js',
			'collections/tba.associates.js',
			'collections/tba.trips.js'
		],
		dequeue = function() {
			var uri = scripts[index];
			if (!uri) {
				tba.app.publish('ready');
			}
			index++;
			$.getScript(uri, dequeue);
		};
		
	// go!
	$(dequeue);

})();