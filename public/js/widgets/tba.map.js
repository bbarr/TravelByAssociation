tba.map = Fugue.create('map', {
	
	events: {
		'tba.app.ready': 'refresh'
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
	},
	
	remove: function(location) {
		
		var markers = this._markers,
			len = markers.length,
			i = 0, marker, removed;
		
		for (; i < len; i++) {
			marker = markers[i];
			if (marker.position.lat() === location.lat && marker.position.lng() === location.lng) {
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
		var location = tba.current_trip.locations.find_one({'_mote_id' : location_id }),
			latlng = new google.maps.LatLng(location.lat, location.lng);
		
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
			lat = location.lat,
			lng = location.lng,
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
			tba.current_trip.current_location = location;
		});
	}
});
