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
    
	var Fugue, _Widget;
    
	_Widget = function(name, query, parent) {

		this.name = name;
		this.query = query || '#' + name;
		this.parent = parent;
		
		this.$container = $(this.query).first();
		this.subscriptions = { '*': [] };
		this.elements = {};
		this.data = {};
		this.widgets = {};
	}

	_Widget.prototype = {
		
		init: function() {
			this.$container.data('fugue', this);
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
		
		refresh: function() {},
		
		state_toggler: function(on, off, prop) {
			
			this[on] = function() {
			
			    this.data[prop] = true;
				this.$container.addClass(prop);

				return this;
			}
			
			this[off] = function() {
                   
                this.data[prop] = false;
				this.$container.removeClass(prop);
				
				return this;
			}
		},
		
		find: function(query) {
			return this.elements[query] || (this.elements[query] = this.$container.find(query));
		},
		
		delegate: function(query, type, fn) {
		    
		    var self = this;
		    
			this.$container.delegate(query, type, function() {
				fn.apply(self, arguments);
			});
			
			return this;
		},
		
		create: function(name, query) {
			
			Widget.prototype = this;
			var extended = new Widget(name, query, this);
			
			return this.widgets[name] = extended;
		},
		
		publish: function(event, data) {
			
			var self = this,
			    subscriptions = this.subscriptions[event] || [], 
			    len = subscriptions.length,
			    i = 0;
			
			// include 'glob' events
			$.merge(subscriptions, this.subscriptions['*']);
				
			data = data || {};	
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
			
				var data = {}, segments, target = fugue;
			
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
	
	window.Fugue = Fugue = new _Widget('fugue', document.body, false)

})();
