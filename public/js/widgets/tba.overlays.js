tba.overlay_config = {

	events: {
		'input blur': 'create_need'
	},
	
	init: function() {
		this.form = this.query('li').last();
	},
	
	create_need: function(e) {

		var value = e.target.value; 
		if ( value === '' ) return;

		this.form.removeClass('error');
		
		var need = new tba.Needs.Document({
			need: value,
			solutions: []
		});
		
		tba.current_trip.current_location.embed(need);
		
		this.add(need)
	},
	
	add: function(need) {
		
		var need_html = tba.views.map.need(need),
			solutions_html = tba.views.map.solutions(need);
		
		this.form.before(need_html);
		this.query('#solutions').append(solutions_html);
	}
}
