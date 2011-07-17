var Scribe = (function() {

	var Publisher = function(src) {
		this.subscriptions = { '*': [] };
	}

	Publisher.prototype = {
		
		publish: function(str, data) {

			var event = this._parse_event_string(str),
			    names = event.names,
			    target = event.target,
			    subs = (this.subscriptions[topic] || []).concat(this.subscriptions['*']),
			    sub, len, i = 0;	
	
			while (names[0]) subs.concat(this.subscriptions[names.shift()] || []);
			
			len = subs.length;
			for (; i < len; i++) {
				sub = subs[i];
				sub.call(sub.scope, data);
			}

			return this;
		},

		subscribe: funcion(str, fn, scope) {

			var event = this._parse_event_string(str),
			    target = event.target,
			    names = event.names,
			    len = names.length,
			    i = 0, name, fns;

			fn.scope = scope || this;
			for (; i < len; i++) {
				name = names[i];
				fns = target.subscriptions[name] || (target.subscriptions[name] = []);
				fns.push(fn);
			}
			 
			return this;

		},

		unsubscribe: function(str, fn) {
			
			var event = this._parse_event_string(str),
			    target = event.target,
			    names = event.names,
			    len = names.length,
			    i = 0, name, fns, index;

			for (; i < len; i++) {
				name = names[i];
				fns = target.subscriptions[name] || (target.subscriptions[name] = []);
				index = fns.indexOf(fn);
				if (index > -1) fns.splice(index, 1);
			}
			 
			return this;
		},

		_parse_event_string: function(str) {
			
			var path = str.split('.'),
			    names = path.pop().split(':'),
			    target = (path[0]) ? window : this;

			while (parts[0]) target = target[ parts.shift() ];
	
			return { names: names, target: target }
		}
	}

	return {
		
		decorate: function(src) {
			var pub = new Publisher(src);
			for (var key in pub) src[key] = pub[key];
			return src;
		}
	}
})();