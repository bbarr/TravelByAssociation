tba.views = {
	
	itinerary: {
		
		list: function(locations) {

			var list = $.build('fragment'),
				self = tba.views.itinerary,
				location = self.location,
				location_input = self.location_input,
				len = locations.length,
				i = 0;
			
			for (; i < len; i++) {
				list.appendChild(location(locations[i]));
			}
			
			// end with input so user can add locaitons
			list.appendChild(location_input());
			
			return list;
		},
		
		location: function(location) {
			var b = $.build;
			return b('li', { 'class': 'location', 'id': 'location-' + location._mote_id }, [
					b('a', { href: '#', 'class': 'delete' }, 'X'),
					b('a', { href: '#', 'class': 'focus' }, '+'),
					b('h3', location.address)
				]);
		},
		
		location_input: function() {
			var b = $.build;
			return b('li', { 'class': 'location'}, [
				b('h3', 'Add Location'),
				b('input', { name: 'address', type: 'text', placeholder: 'Address' })
			]);
		}
	},
	
	map: {
		
		overlay: function(id) {
			var b = $.build;
			return b('div', { id: id, 'class': 'location-overlay' }, [
				tba.views.map.needs,
				b('div', { 'id': 'solutions' })
			]);
		},
		
		needs: function() {
			var b = $.build;
			return b('div', { 'class': 'needs' }, [
				b('h3', 'Needs'),
				b('ul', [
					b('li', b('input', { 'type': 'text' }))
				])
			]);
		},
		
		need: function(need) {
			var b = $.build;
			return b('li', { id: 'need-' + need._mote_id }, need.need);
		},
		
		solutions: function(need) {
			var b = $.build;
			return b('div', { 'id': 'solutions-' + need._mote_id }, [
				b('h3', 'Solutions'),
				b('ul', [
					b('li', b('input', { 'type': 'text' } ))
				])
			]);
		}
	}
}