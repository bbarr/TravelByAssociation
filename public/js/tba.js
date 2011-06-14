
var tba = (function() {
	
	var location;
	
	location = {
		
		get_trip_id: function() {
			var hash = window.location.hash;
			return hash ? hash.substr(1) : false;
		}
	}
	
	return {
		
		init: function() {
			this.current_trip = new tba.Trips.Document();
			this.refresh();
		},
		
		refresh: function() {

			var trip_id = location.get_trip_id(),
				self = this;
				
			if (trip_id) {
				tba.app.loading();
				tba.Trips.Remote.fetch(trip_id, function(data) {
					self.current_trip.data = data;
					self.current_trip.save();
					tba.app.loaded();
				});
			}
		}
	}
})();