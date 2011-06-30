Fugue.state_toggler('loading', 'loaded');

tba.app = Fugue.create('app', document.body, {

	events: {
		'ready': 'refresh'
	},

	init: function() {
		tba.Trips.subscribe('change.insert', function(data) {
			tba.current_trip = tba.Trips.documents[0];
			this.publish('ready');
		}, this);
	},
	
	refresh: function() {

		var hash = window.location.hash,
		    id = (hash) ? hash.substr(1) : false;
		
		if (id) tba.Trips.fetch(id);
		else new tba.Trips.Document().save();
	}
	
});

tba.overlay_config = {
	events: {
		'p click': function() {  }
	}
}

tba.map = Fugue.create('map', {
	
	events: {
		'app.ready': 'refresh'
	},
	
	_markers: [],
	_overlays: [],
	_poly: null,
	_map: null,
	
	_map_config: {
		zoom: 5,
		center: new google.maps.LatLng(40.77, -73.98), // new york, cause why not
		mapTypeId: google.maps.MapTypeId.ROADMAP
	},
	
	init: function() {
		var self = this;
		this._map = new google.maps.Map(this.$container[0], this._map_config);
	},
	
	refresh: function() {
		tba.current_trip.data.locations.subscribe('change.remove', this.remove, this);
		tba.current_trip.data.locations.subscribe('change.insert', this.add, this);
	},
	
	remove: function(location) {
		
		var markers = this._markers,
			len = markers.length,
			i = 0, marker, removed;
		
		for (; i < len; i++) {
			marker = markers[i];
			if (marker.position.lat() === location.data.lat && marker.position.lng() === location.data.lng) {
				removed = this._markers.splice(i, 1);
				removed[0].setMap(null);
				removed = this._overlays.splice(i, 1);
				removed[0].destroy();
				break;
			}
		}
		
		this.focus_reset();
	},
	
	geocode: function(address, cb) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({ address: address }, cb);
	},
	
	add: function(location) {
		var marker = this._generate_marker(location);
		this._generate_overlay(location, marker);
		this.focus_reset();
	},
	
	focus: function(location_id) {
		var location = tba.current_trip.data.locations.find_one({'_mote_id' : location_id }),
			latlng = new google.maps.LatLng(location.data.lat, location.data.lng);
		
		this._map.setCenter(latlng);
		this._map.setZoom(15);
	},
	
	focus_reset: function() {

		var markers = this._markers,
			len = markers.length,
			i = 0,
			bounds = new google.maps.LatLngBounds(),
			locs = [], loc;
		
		for (; i < len; i++) {
			loc = markers[i].position;
			bounds.extend(loc);
			locs.push(loc);
		}

		if (bounds.isEmpty()) {
			this._map.setCenter(this._map_config.center);
			this._map.setZoom(this._map_config.zoom);
		}
		else {
			this._map.fitBounds(bounds);
			if (this._map.getZoom() > 15) {
				this._map.setZoom(15);
			}
		}
		
		this.redraw_poly(locs);
	},
	
	redraw_poly: function(locs) {
		var self = this;
		if (this._poly) this._poly.setMap(null);
		if (locs.length > 1) {
			this._poly = new google.maps.Polyline({
				map: self._map,
				path: locs,
				strokeColor: '#ff0000',
				strokeOpacity: 1.0,
				strokeWeight: 1,
				geodesic: true
			});
			this._poly.setMap(this._map);
		}
	},
	
	_generate_marker: function(location) {

		var self = this,
			lat = location.data.lat,
			lng = location.data.lng,
			latlng = new google.maps.LatLng(lat, lng),
			marker = new google.maps.Marker({
				map: self._map,
				position: latlng
			});
			
		this._markers.push(marker);
		return marker;
	},
	
	_generate_overlay: function(location, marker) {

		var overlay_id = 'location-overlay-' + location._mote_id,
			overlay_content = document.body.appendChild(tba.views.map.overlay(overlay_id)),
			info_window = new google.maps.InfoWindow({ content: overlay_content }),
			widget = Fugue.create(overlay_id, tba.overlay_config);
		
		widget.info_window = info_window;
		this._overlays.push(widget);
		
		google.maps.event.addListener(marker, 'click', function() {
			info_window.open(marker.getMap(), marker);
		});
	}
});

tba.itinerary = Fugue.create('itinerary', 'sidebar', {
	
	events: {
		'app.ready': 'refresh',
		'input blur': 'create_location',
		'a.delete click': function(e) {

			var $el = $(e.currentTarget).parent('li'),
				_mote_id = $el.attr('id').split('-')[1];

			e.preventDefault();

			tba.current_trip.data.locations.remove(_mote_id);
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
				
			tba.current_trip.embed(new tba.current_trip.data.locations.Document({ 
				address: result.formatted_address,
				lat: loc.lat(),
				lng: loc.lng()
			}));
			
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

		var trip = tba.current_trip,
			list = tba.views.itinerary.list(trip.data.locations);
			
		this.query('#itinerary').html(list);
		this.form = this.$container.find('li').last();
		
		tba.current_trip.data.locations.subscribe('change.insert', this.add, this);
		tba.current_trip.data.locations.subscribe('error.insert', this.error, this);
		tba.current_trip.data.locations.subscribe('change.remove', this.remove, this);
	}
});
