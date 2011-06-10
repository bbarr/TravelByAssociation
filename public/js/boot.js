var tba = {};

// dynamically load everything we need... 
// will likely replace this with a "real" solution
(function() {

	var index = 0,
		scripts = [
			'lib/mote.js',
			'lib/fugue.js',
			'tba.app.js',
			'tba.collections.js'
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