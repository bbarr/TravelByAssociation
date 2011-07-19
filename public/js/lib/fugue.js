/**
 *  Fugue - Minimal, modular JS application framework.
 *  
 *  Constructs objects that rely on their jQuery element container, 
 *  but with abstracted data handling, and allows these object to
 *  relate to each other independent of DOM structure.
 *
 *  @author Brendan Barr brendanbarr.web@gmail.com
 */

var Fugue = (function() {

	var Widget = function(name, query, ext) {

		Remotely.decorate(this);
		
		this.name = name;
		this.$container = $(query).first();

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

			if (has_events) this._extend_events(obj.events);
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

    // PRIVATE

			_extend_events: function(events) {

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

	return {
		
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