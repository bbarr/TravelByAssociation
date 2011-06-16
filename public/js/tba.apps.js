tba.run = function() {
	
	var apps = Sammy.apps,
		name;

	for (name in apps) apps[name].run();
}

tba.app = Sammy(function() {
	
	// configuration
	this.debug = true;
	this.element_selector = 'body';
	this.raise_errors = true;
	this.run_interval_every = 100;
	
	// plugins
	this.use(Sammy.JSON);
	this.use(Sammy.Haml);
	
	this.get('/', function() {
		console.log('home');
	});
});

tba.notifier = Sammy('#flash', function() {

	this.helpers({
		
		deliver: function(type, message) {
			this.$element()
				.find('.' + type)
					.removeClass('hide')
					.find('div')
						.html(message);
						
		},
		
		notice: function(message) {
			this.deliver('notice', message);
		},
		
		error: function(message) {
			this.deliver('error', message);
		}
	});

	this.get('/', function() {
		this.notice('Welcome to Travel By Association! Create a trip and share it with people who probably care about you somewhat!');
	});
	
	this.bind('click', function(e) {
		console.log(e)
	});
});