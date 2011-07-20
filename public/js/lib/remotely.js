var Remotely = (function() {

  var Obj, Collection, Action, Request, Response;

	Obj = function(src) {
	  Scribe.decorate(this);
	};

	Obj.prototype = {
	
		route: function(data) {
			for (key in data) new Action(this, key, data[key]);
		},
		
		to_json: function() {
			return JSON.stringify(this.collapse());
		},

		generate_crud: function(name) {
			this.route({
			  read: 'GET ' + name,
			  insert: 'POST ' + name,
			  update: 'PUT ' + name + '/:id',
			  del: 'DELETE ' + name + '/:id'
			});
		}		
	};
	
	Collection = function() {
	  this.objects = [];
	}
	
	Collection.prototype = {
	  
	  collapse: function() {
	    
	    var collapsed = [],
	        objects = this.objects,
	        len = objects.length,
	        i = 0;
	        
	    for (; i < len; i++) {
	      collapsed.push(objects[i].collapse());
	    }
	  },
	  
    add: function(obj) {
      this.objects.push(obj);
    }
	}

	Action = function(host, name, full_template) {
	
		this.name = name;
		this.host = host;	
	
		var parts = full_template.split(' ');
		this.method = parts[0];
		this.template = parts[1];
	
		this.params = this.template.match(/\:\w*/) || [];
		
    this._arm(host);
	}

	Action.prototype = {
			
		fire: function() {
			var request = new Request(this, arguments);
			$.ajax(request.generate_config());
		},
		
		_arm: function(host) {
		  var self = this;
		  host[this.name] = function() {
		    self.fire(arguments);
		  }
		}
	};

  Request = function(action, arguments) {
    this.action = action;
    this.params = [].slice.call(arguments, 0);
		this.data = (action.params.length < this.params.length) ? this.params.pop() : {};
    this.method = this.method;
		this.uri = this.generate_uri();
		
		var name = this.action.name;
		this.success = this.generate_callback(name + '_success');
		this.error = this.generate_callback(name + '_error');
		this.complete = this.generate_callback(function(response) { return response.xhr.status + ':' + name });
  }
  
  Request.prototype = {
    
    generate_config: function() {

      var self = this;

      return {
				url: self.uri,
				type: self.method,
				data: self.data,
				contentType: self.content_type,
				success: self.success,
				error: self.error
			}
    },
    
    generate_uri: function() {

      var uri = this.action.template,
			    request_params = this.params,
			    action_params = this.action.params,
			    len = action_params.length,
			    i = 0;
	
			for (; i < len; i++) uri = uri.replace(action_params[i], request_params[i]);
	
      return uri;
    },

    generate_callback: function(event_name) {
      var self = this;
      return function() {
        var response = new Response(arguments);
        event_name = (typeof event_name === 'function') ? event_name(response) : event_name;
        self.action.host.publish(event_name, response);
      }
    }
  }
  
  Response = function(args) {
    this.xhr = args[0];
    this.data = args[2];
  }
  
  Response.prototype = {};

	return {
    
    Obj: Obj,
    Request: Request,
    Response: Response,
    Collection: Collection,
    
		decorate: function(src) {
			var obj = new Obj(src);
			for (var key in obj) src[key] = obj[key];
			return obj;
		}
	}
})();