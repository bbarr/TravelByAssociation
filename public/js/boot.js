
// project namespace
var tba = {};

// dynamically load everything we need... 
// will likely replace this with a "real" require solution
(function() {

	var index = 0,
		scripts = [
			'lib/jquery.js',
			'lib/mote.js',
			'lib/sammy.js',
			'tba.collections.js',
			'tba.app.js'
		],
		dequeue = function() {
			
			var uri = scripts[index];
			if (!uri) {
				tba.app.run();
				return;
			}

			index++;
			$.getScript('/js/' + uri, dequeue);
		};

	// go!
	$(dequeue);

})();