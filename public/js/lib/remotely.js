var Remotely = (function() {

  var Obj, Action;

	Obj = function(src) {
		this.keys = src.keys || [];
	};

	Obj.prototype = {
	
		route: function(data) {
		    
		    var self = this,
		        action, key;

			for (key in data) {
				this[key] = function() {
				    action = new Remotely.Action(self, key, data[key]);
				    action.fire(arguments);
			    }
			}
		},

		generate_crud: function(name) {
			this.route('read', 'GET ' + name);
			this.route('insert', 'POST ' + name);
			this.route('update', 'PUT ' + name + '/:id');
			this.route('delete', 'DELETE ' + name + '/:id');
		},
	    
		to_json: function() {
			return JSON.stringify(this.collapse());
		},
		
		collapse: function() {
			
			var data = {}, 
			    keys = this.keys,
			    key, prop;
			
			for (key in this) {
				prop = this[key];
				if (keys[0] && keys.indexOf(key) === -1) continue;
				data[key] = typeof prop._collapse === 'function' ? prop._collapse() : prop;
			}
			
			return data;
		}
		
	};

	Action = function(host, name, full_template) {
	
		this.name = name;
		this.host = host;	
	
		var parts = full_template.split(' ');
		this.method = parts[0];
		this.template = parts[1];
	
		this.params = this.template.match(/\:\w*/) || [];
	}

	Action.prototype = {
			
		fire: function(args) {
	
			var request = this._generate(args);
	
			$.ajax({
				url: request.uri,
				type: request.method,
				data: request.data,
				contentType: request.content_type,
				success: request.success,
				error: request.error
			});
		},
	
		_generate: function(args) {
	
			var request = {};
			
			request.params = [].slice.call(args, 0);
			request.data = (this.params.length < request.params.length) ? request.params.pop() : {};
	        request.method = this.method;
	
			this._decorate_uri(request);
			this._decorate_callbacks(request);
	
			return request;
		},
	
		_decorate_uri: function(request) {
	
			var uri = this.template,
			    request_params = request.params,
			    action_params = this.params,
			    len = action_params.length,
			    i = 0;
	
			for (; i < len; i++) uri = uri.replace(action_params[i], request_params[i]);
	
			request.uri = uri;
		},
	
		_decorate_callbacks: function(request) {
		
			var self = this;
			
			request.success = function(data) {
				self.host.publish(self.name + '_success', data);
			};
	
			request.error = function(data) {
				self.host.publish(self.name + '_error', data);
			};
			
		}
	};


	return {

		decorate: function(src) {
			var obj = new Obj(src);
			for (var key in obj) src[key] = obj[key];
			return obj;
		}
	}
})();