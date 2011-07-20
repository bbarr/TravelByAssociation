tba.views = {
	
	itinerary: {
		
		list: function(locations) {

			var list = document.createDocumentFragment,
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

			var template = Template
				.li({ 'class': 'location', id: 'location-' + location._mote_id })
					.a({ href: '#', 'class': 'delete' }).end()
					.a({ href: '#', 'class': 'focus' }).end()
					.h3(location.address)

			return template.to_html();
		},
		
		location_input: function() {

			var template = new Template()
				.li({ 'class': 'location' })
					.h3('Add Location').end()
					.input({ name: 'address', type: 'text', placeholder: 'Address' });
			
			return template.to_html();
		}
	},
	
	map: {
		
		overlay: function(id) {

			var template = new Template()
				.div({ id: id, 'class': 'location-overlay' })
					.div({ 'class': 'needs' })
						.h3('Needs').end()
						.ul()
							.li()
								.input({ type: 'text' })
							.end()
						.end()
					.end()
					.div({ id: 'solutions' });
			
			return template.to_html();
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