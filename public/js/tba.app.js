var tba = {};

tba.app = (function() {
	
	var _events = {};
	
	return {
		
		publish: function(event, data) {
			
			var fns = _events[event] || [],
				len = fns.length,
				i = 0;
			
			for (; i < len; i++) fns[i](data);
		},
		
		subscribe: function(event, fn) {
			_events[event] || (_events[event] = []);
			_events[event].push(fn);
		}
	}
	
})();