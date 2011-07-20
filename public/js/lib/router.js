var Router = {

	clean_array: function(arr) {
		var clean = [];
		for (var i = 0, len = arr.length; i < len; i++) {
			if (arr[i] !== '') clean.push(arr[i]);
		}
		return clean;
	},

	run: function() {
		var hash = window.location.hash;
		if (hash.length === 0) return;
		Router.match(hash.substr(1));
	},

	match: function(hash) {

		var templates = Router.subscriptions,
		    hash_segments = Router.clean_array(hash.split('/')),
		    i = 0, x = 0,
		    len = templates.length, x_len,
		    segments, args = {}, match;
console.log(templates);
		for (var key in templates) {

			segments = Router.clean_array(key.split('/'));
			if (segments.length !== hash_segments.length) continue;
			args = {};
			match = true;

			for (x_len = segments.length; x < x_len; x++) {

				if (segments[x].charAt(0) === ':') {
					console.log(segments[x].substr(1), hash_segments[x]);
					args[segments[x].substr(1)] = hash_segments[x];
				}
				else if (segments[x] !== hash_segments[x]) match = false;


				if ((x + 1) === x_len && match) this.share(key, args);
			}
		}
	},

	share: function(temp, params) {
		Router.publish(temp, params);
	},

	init: function() {

		Scribe.decorate(Router);
		Router.subscribe('/hi', function(e) { console.log('/hi matched', e) });
		Router.subscribe('/hi/:foo', function(e) { console.log('/hi/:foo matched', e) });

		$(window).bind('hashchange', function(e) {
			Router.run();
		});

		Router.run();
	}
}

Router.init();