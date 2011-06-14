/**
 *  Fugue - Minimal, modular JS application framework.
 *  
 *  Constructs objects that rely on their jQuery element container, 
 *  but with abstracted data handling, and allows these object to
 *  relate to eachother independent of DOM structure.
 *
 *  @author Brendan Barr brendanbarr.web@gmail.com
 */

(function() {

	var Widget = function(name, query, ext, parent) {

		if (!ext) {
			parent = ext;
			ext = query;
			query = '#' + name;
		}

		this.name = name;
		this.container_query = query || '#' + name;
		this.parent = parent;

		this.$container = $(this.container_query).first();
		this.$container.data('fugue', this);
		this.subscriptions = { '*': [] };
		this.elements = {};
		this.data = {};

		this.widgets = {};
		this.traits = {};

		if (ext) this.extend(ext);
		if (this.init) this.init();
	}

	Widget.prototype = {

		extend: function(obj) {

			var key,
				prop,
				event_key,
				event_prop,
				event_type,
				events;

			for (key in obj) {
				prop = obj[key];
				if (key === 'events') {
					events = prop;
				}
				else {
					this[key] = obj[key];
				}	
			}
			
			if (events) {
				for (event_key in events) {
					event_prop = events[event_key];
					query = event_key.split(' ');
					event_type = query.pop();
					cb = typeof event_prop === 'string' ? this[event_prop] : event_prop;
					this.delegate(query.join(''), event_type, cb);
				}
			}
			return this;
		},

		create: function(name, query, block) {
			return this.widgets[name] = new Widget(name, query, block, this)
				.extend(this.traits);
		},

		destroy: function() {

	           var self = this;

			// remove reference from element
	           this.$container.removeData('fugue');

			// remove all classes
	           $(this.data).each(function(prop) { self.$container.removeClass(prop) });

			// pass destroy command to all children widgets
	           $(this.widgets).each(function(v) { v.destroy() });

			// finally, remove this widget
			if (this.parent) delete this.parent.widgets(this.name);
		},

		state_toggler: function(on, off, prop) {

			this.traits[on] = this[on] = function() {

			    this.data[prop] = true;
				this.$container.addClass(prop);

				return this;
			}

			this.traits[off] = this[off] = function() {

	               this.data[prop] = false;
				this.$container.removeClass(prop);

				return this;
			}

			return this;
		},

		query: function(query) {
			return this.elements[query] || (this.elements[query] = this.$container.find(query));
		},

		delegate: function(query, type, fn) {
		    var self = this;
			this.$container.delegate(query, type, function() {
				fn.apply(self, arguments);
			});
			return this;
		},

		publish: function(event, data) {

			var self = this,
			    subscriptions = (this.subscriptions[event] || []).concat(this.subscriptions['*']),
			    len = subscriptions.length,
			    i = 0;

			for (; i < len; i++) subscriptions[i](data);

			return this;
		},

		subscribe: function(event_string, fn) {

			if (typeof event === 'function') {
				fn = event;
				event = '*';
			}

			var self = this,
		    	event = this._parse_event_string(event_string), 
		    	target = event.target, 
		    	name = event.name,
			    formatted_fn,
			    fns;

			formatted_fn = function(data) { fn.call(self, data); }
			formatted_fn.original_fn = fn;
			fns = target.subscriptions[name] || (target.subscriptions[name] = []);
			fns.push(formatted_fn);

			return this;
		},

		unsubscribe: function(event, fn) {

			if (typeof event === 'function') {
				fn = event;
				event = '*';
			}

			var event = this._parse_event_string(event), 
			    fns = event.target.subscriptions[event.name], 
			    len = fns.length, 
			    i = 0;

			for (; i < len; i++) {
				if (fns[i].original_fn === fn) {
					fns.splice(i, 1);
					return;
				}
			}

			return this;
		},

		// PRIVATE

			_parse_event_string: function(event_string) {

				var data = {}, segments, target = Fugue;

				segments = event_string.split('.');

				while (segments[1]) {
					target = target.widgets[segments.shift()];
				}

				data.target = target;
				data.name = segments[0];

				return data;
			}

		// END PRIVATE
	}
	
	window.Fugue = new Widget('base', document.body, {});
})();