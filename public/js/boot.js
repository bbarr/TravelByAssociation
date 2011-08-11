
var tba = {};

(function() {
  
  if (!document.getElementById('itinerary')) return;
  
	var index = 0,
		scripts = [

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