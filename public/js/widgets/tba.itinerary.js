tba.itinerary = Fugue.create('itinerary', 'sidebar', {
	
	events: {
		'tba.app.ready': 'refresh',
		'input blur': 'create_location',
		'a.delete click': function(e) {

			var $el = $(e.currentTarget).parent('li'),
				_mote_id = $el.attr('id').split('-')[1];

			e.preventDefault();

			tba.current_trip.locations.remove(_mote_id);
		},
		'a.focus click': function(e) {
			
			var $el = $(e.currentTarget).parent('li'),
				_mote_id = $el.attr('id').split('-')[1];

			e.preventDefault();

			tba.map.focus(_mote_id);
		}
	},
	
	init: function() {},
	
	create_location: function(e) {

		var value = e.target.value; 
		if ( value === '' ) return;

		this.form.removeClass('error');

		tba.map.geocode(value, function(results) {

			var result = results[0],
				loc = result.geometry.location;
        loc_obj = { 
  				address: result.formatted_address,
  				lat: loc.lat(),
  				lng: loc.lng()
  			};
  			
      tba.app.trip.locations.push(loc_obj);
		  tba.app.trip.publish('location_added', loc_obj);
		});  
	},

	error: function(errors) {
		this.form.addClass('error');
	},

	add: function(location) {
		
		var html = tba.views.itinerary.location(location);
		
		this.form
			.before(html)
			.find('input').attr('value', '')
			.removeClass('error');
	},
	
	remove: function(location) {
		this.query('#location-' + location._mote_id).remove();
	},
	
	refresh: function() {

		var trip = tba.app.trip,
			list = tba.views.itinerary.list(trip.locations);

		this.query('#itinerary').html(list);
		this.form = this.$container.find('li').last();
	}
});