Mote.Rest = function() {
	
	this.collection = {
		
	}
	
	this.document = {
			
		load: function(_id) {
			$.get('/api?blah=foo', function(data) {
				console.log(data)
			});
		}
	}
}