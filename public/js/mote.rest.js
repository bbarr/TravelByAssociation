Mote.Rest = function() {
	
	this.collection = {
		
	}
	
	this.document = {
			
		load: function(_id) {
			$.getJSON('https://mongolab.com/api/1/databases/tba/collections?apiKey=4dd166305e4c8769e3e8e09a', function(data) {
				console.log(data);
			});
		}
	}
}