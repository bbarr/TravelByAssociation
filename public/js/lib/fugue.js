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

		var events;

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

		if (ext) {
			if (ext.events) {
				events = ext.events;
				delete ext.events;
			}	
			this.extend(ext);
			this._extend_events(events);
		}
		
		if (this.init) this.init();
	}

	Widget.prototype = {

		extend: function(obj) {
			var key;
			for (key in obj) this[key] = obj[key];
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

		subscribe: function(event, fn) {

			if (typeof event === 'function') {
				fn = event;
				event = '*';
			}

			var self = this,
		    	event = this._parse_event_string(event), 
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
			},
			
			_extend_events: function(events) {

				var query,
					key,
					prop,
					type,
					cb;

				for (key in events) {
					prop = events[key];
					query = key.split(' ');
					type = query.pop();
					cb = typeof prop === 'string' ? this[prop] : prop;

					if (query.length > 0) {
						this.delegate(query.join(''), type, cb);
					} 
					else {
						this.subscribe(type, cb);
					}
				}
			}

		// END PRIVATE
	}
	
	window.Fugue = new Widget('base', document.body, {});
})();