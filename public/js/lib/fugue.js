/**
 *  Fugue - Minimal widgiting
 *
 *  @author Brendan Barr brendanbarr.web@gmail.com
 */

var Fugue = (function() {

	var Widget = function(name, query, ext) {
		Scribe.decorate(this);
		this.name = name;
		this.$container = $(query).first();
		this.elements = {};
		this.states = {};
		this.extend(ext);
		this.init();
	}

	Widget.prototype = {

		init: function() {},

		destroy: function(soft) {
			delete Fugue[this.name];
	    		return this.$container[ soft ? 'detach' : 'remove' ]();
		},

		extend: function(obj) {
		  
			for (key in obj) {
			  if (key === 'events') continue;
				this[key] = obj[key];
			}
			
			if (typeof obj.events !== 'undefined') {
			  this._extend_events(obj.events);
			}

			return this;
		},

		state_toggler: function(on, off, prop) {
			
			prop || (prop = on);
			
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

      _generate_scoped_cb: function(self, cb) {
        return function() {
          cb.apply(self, arguments);
        }
      },

			_extend_events: function(events) {

				var query, key, prop, type, cb, scoped_cb,
				    self = this;

				for (key in events) {
					prop = events[key];
					query = key.split(' ');
					type = query.pop();
					cb = typeof prop === 'string' ? this[prop] : prop;
					scoped_cb = self._generate_scoped_cb(self, cb);
          
					if (query.length > 0) {
						this.$container.delegate(query.join(' '), type, scoped_cb);
					} 
					else {
						this.subscribe(type, scoped_cb);
					}
				}
			}
			
		// END PRIVATE
	}

	return {
		
		create: function(name, query, ext) {

			if (typeof this[name] !== 'undefined') throw new Error('Widget: ' + name + ' already exists');
			
			if (!ext) {
				ext = query || {};
				query = '#' + name;
			}
			
			return this[name] = new Widget(name, query, ext);
		}
	};

})();