
tba.proxy = {
	
	uri_templates: {},
	
	request: function(template_name, data) {
		
		var uri = this.generate_uri(template, data);
			request;
		
		request = $.ajax({
			
		});
		
		return request;
	},
	
	generate_uri: function(template_name, data) {
		var template = this.uri_templates[template_name];
		template = template.replace(/:([\w-_]*)/, "$1");
	}
}