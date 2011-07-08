/**
 *  Fugue - Minimal, modular JS application framework.
 *  
 *  Constructs objects that rely on their jQuery element container, 
 *  but with abstracted data handling, and allows these object to
 *  relate to each other independent of DOM structure.
 *
 *  @author Brendan Barr brendanbarr.web@gmail.com
 */

(function() {

	var Widget = function(name, query, ext) {
		
		this.name = name;
		this.$container = $(query).first();

		this.subscriptions = { '*': [] };
		this.elements = {};
		this.states = {};

		this.extend(ext);
		
    if (this.init) this.init();		
	}

	Widget.prototype = {

		extend: function(obj) {
			var key,
			    has_events = false;
			for (key in obj) {
				if (key === 'events') {
				  has_events = true;
				  continue;
				}
				else this[key] = obj[key];
			}
			if (has_events) this._bind(obj.events);
			return this;
		},

		destroy: function(soft) {
		    delete Fugue[this.name];
	    	return this.$container[ soft ? 'detach' : 'remove' ]();
		},

		state_toggler: function(on, off, prop) {
			
			prop || (prop = on);
			
			if (typeof this[on] !== 'undefined') throw new Error('this[' + on + '] is already defined');
			if (typeof this[off] !== 'undefined') throw new Error('this[' + off + '] is already defined');
			if (typeof this[prop] !== 'undefined') throw new Error('this[' + prop + '] is already defined');
			
			this[on] = function() {
				this.states[prop] = true;
				this.$container.addClass(prop);
				return this;
			};

			this[off] = function() {
		    this.states[prop] = false;
				this.$container.removeClass(prop);
				return this;
			};

			return this;
		},

		query: function(query) {
			return this.elements[query] || (this.elements[query] = this.$container.find(query));
		},

		publish: function(event_string, data, scope) {

			var self = this,
			    event = this._parse_event_string(event_string),
			    target = event.target,
			    name = event.name,
			    subscriptions = (target.subscriptions[name] || []).concat(target.subscriptions['*']),
			    len = subscriptions.length,
			    i = 0, fn;

			for (; i < len; i++) {
			  fn = subscriptions[i];
			  fn.call(fn.scope, data);
      }
      
			return this;
		},

		subscribe: function(event_string, fn, scope) {

			var event = this._parse_event_string(event_string),
			    target = event.target,
			    name = event.name,
			    fns = target.subscriptions[name] || (target.subscriptions[name] = []);
      
      fn.scope = scope || this;
			fns.push(fn);
			return this;
		},

		unsubscribe: function(event, fn) {
		    
			var fns = this.subscriptions[event], 
			    len = fns.length, 
			    i = 0;

			for (; i < len; i++) {
				if (fns[i] === fn) {
					fns.splice(i, 1);
          break;
				}
			}

			return this;
		},

		// PRIVATE
		
		  _parse_event_string: function(string) {
		    
		    var parts = string.split('.'),
		        name = parts.pop(),
		        target = window;

        if (parts.length === 0) target = this;
        else {
          
          if (parts[0] === 'this') {
            target = this;
            parts.shift();
          }
          
          while (parts[0]) target = target[ parts.shift() ];
        }
		    
		    return { name: name, target: target };
		  },

			_bind: function(events) {

				var query, key, prop, type, cb, scoped_cb,
				    self = this;

				for (key in events) {
					prop = events[key];
					query = key.split(' ');
					type = query.pop();
					cb = typeof prop === 'string' ? this[prop] : prop;

          scoped_cb = function() { cb.apply(self, arguments) };

					if (query.length > 0) {
						this.$container.delegate(query.join(' '), type, scoped_cb);
					} 
					else {
						this.subscribe(type, cb, this);
					}
				}
			}

		// END PRIVATE
	}

	window.Fugue = {
		
		create: function(name, query, ext) {
			
			if (typeof name === 'undefined') throw new Error('Widget requires first argument (name)');
			if (typeof this[name] !== 'undefined') throw new Error('Widget: ' + name + ' already exists');
			
			if (!ext) {
				ext = query || {};
				query = '#' + name;
			}
			
			return this[name] = new Widget(name, query, ext);
		}
	};

})();