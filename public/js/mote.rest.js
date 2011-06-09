Mote.REST = function() {

	this.base_uri = '';
	this.ajax = $.ajax;

	this.collection = {
	
		_append_segments: function(uri, segments) {
			return uri.concat(segments);
		},

		_append_query: function(uri, query) {

			var query_string = '?',
		 	    key;

			for (key in query) query_string += (key + '=' + query[key].toString() + '&');
	
			query_string = query_string.substr(0, query_string.length - 1);
			uri.append(query_string);
		},
			
		generate_uri: function(segments, query) {	

			var uri = [this.base_uri, this.name];

			if (query) {
				uri = this._append_segments(uri, segments);
				uri = this._append_query(uric, query);
			}
			else {
				if (segments[0]) uri = this._append_segments(uri, segments);
				else uri = this._append_query(uri, segments);
			}

			return uri.join('/');
		},

		query: function(query) {
			var self = this;
			this.ajax({
				url: self.collection.generate_uri(query),
				method: 'GET',
				complete: function(data) {
					console.log(data);
				}
			});
		}
	}
	
	this.document = {
	  
		remote_load: function(_id) {
			var self = this;
			this.ajax({
				url: self.collection.generate_uri(_id),
				method: 'GET',
				complete: function(data) {
					console.log(data);
				});
			});
		},
		
		persist: function() {

			var self = this,
			    method,
			    url;

			if (this.is_persisted()) {
				method = 'PUT';
				url = this.collection.generate_uri(this.data['_id']);
			}
			else {
				method = 'POST';
				url = this.collection.generate_uri();
			}

			this.ajax({
				url: url,
				data: self.data,
				type: method,
				complete: function(data) {
					console.log(data);
				}
			});
		}
	}
}