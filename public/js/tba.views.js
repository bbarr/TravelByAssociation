tba.views = {
	
	itinerary: {
		
		list: function(locations) {

			var list = $.build('fragment'),
				entry = tba.views.itinerary.entry,
				len = locations.length,
				i = 0;
			
			for (; i < len; i++) {
				list.appendChild(entry(locations[i]));
			}
			
			return list;
		},
		
		entry: function(location) {
			location || (location = {});
			var b = $.build;
			return b('li', { 'class': 'entry' }, [
				b('h3', location.name || ''),
				b('label', 'address'),
				b('input', { name: 'address', type: 'text' })
			]);
		}
	}
}