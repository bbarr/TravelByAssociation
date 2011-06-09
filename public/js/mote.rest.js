Mote.REST = function() {
	
	this.collection = {
	
	  	get_base_uri: function() {
			return '/db/' + this.name;
		},
	
		generate_uri: function(segments, query) {
			var uri = this.get_base_uri();
			
			if (segments) {
				
				if (segments[0]) {
					uri += ('/' + segments.join('/'));
				}
				
				else {

				}
			}
			
			return uri;
		}
	}
	
	this.document = {
	  
		load: function(_id) {
			$.get(this.collection.generate_uri([_id]), function(data) {
				
			});
		},
		
		persist: function() {
			if (typeof this.data['_id'] === 'undefined') {
				$.post(this.collection.generate_uri(), this.data, function(data) {
					console.log(data);
				});
			}
		}
	}
}