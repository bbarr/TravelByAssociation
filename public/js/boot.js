
// project namespace
var tba = {};

// dynamically load everything we need... 
// will likely replace this with a "real" require solution
(function() {

	var index = 0,
		scripts = [
			'lib/mote.js',
			'lib/fugue.js',
			'tba.collections.js',
			'tba.widgets.js'
		],
		dequeue = function() {
			
			var uri = scripts[index];
			if (!uri) {
				tba.app.ready();
				return;
			}

			index++;
			$.getScript('/js/' + uri, dequeue);
		};

	// go!
	$(dequeue);

})();