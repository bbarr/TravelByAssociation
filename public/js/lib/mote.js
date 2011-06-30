/**
 *  MoteJS is MongoDB-style javascript storage.
 *  
 *  - Documents are represented by simple javascript Objects.
 *  - Collections manage these "documents" and help keep the store in synch.
 *  - Extend functionality with custom plugins
 *  - (Optional) RESTful persistance based on MongoLab's API.
 *
 *  @author Brendan Barr brendanbarr.web@gmail.com
 */

var Mote = {
	version: '0.1'
};

Mote.Collection = function(block) {
	
	var self = this;
	
	if (typeof block === 'undefined') throw new Exception('Collection requires an initialize function');
	
	// defaults to be overridden in block
	self.name = '';
	self.keys = [];

	self.errors = {};

	Mote.Util.extend(self, new Mote.Publisher);
	Mote.Util.extend(self, Mote.Collection.prototype);

	self.cap_size = 0;
	self.documents = [];
	self.Document = function(data) {

		var extend = Mote.Util.extend;

		this.collection = self;
		this.data = {};

		extend(this, self.Document.initial, true);
		extend(this, new Mote.Publisher);
		extend(this.data, data);
	}

	self.Document.initial = { data: {} };
	self.Document.prototype = Mote.Util.clone(Mote.Document);
	
	// run user provided initialization
	block.call(self, self);

	if (self.name === '') throw new Exception('Collection requires a name');
}

Mote.Collection.prototype = {
	
	plugin: function(Feature, block) {

		var feature = new Feature(this),
		    extend = Mote.Util.extend;

		// optional custom init
		if (block) block.call(this, feature);

		extend(this, feature);

		if (feature.init) {
			feature.init();
		}

		if (Feature.document_initial) {
			extend(this.Document.initial, Feature.document_initial, true);
		}			

		if (Feature.document_prototype) {
			extend(this.Document.prototype, Feature.document_prototype);
		}
	},
	
	find: function(queries, limit) {

		var docs = this.documents,
			matches = [],
			_mote_id,
			key,
			match;
			
		for (_mote_id in docs) {
			
			doc = docs[_mote_id];
			match = true;			
			
			for (key in queries) {
				if (queries[key] !== '*' && doc.data[key] != queries[key] && doc[key] != queries[key]) {
					match = false;
					break;
				}
			}
			
			if (match) matches.push(doc);
			
			if (limit) {
				if (matches.length === limit) {
					break;
				}
			}
		}

		return matches;
	},

	find_one: function(query) {
		return this.find(query, 1)[0];
	},

	index_of: function(doc) {

		var index = -1,
		    doc_id = doc._mote_id,
		    docs = this.documents,
		    len = docs.length,
   		    i = 0;

		if (!doc_id) return index;		

		for (; i < len; i++) {
			if (docs[i]._mote_id === doc_id) {
				index = i;
				break;
			}
		}

		return index;
	},

	insert: function(doc) {

		var docs = this.documents;		

		if (!this.validate(doc)) {
			this.publish('error.insert', this.errors);
			return false;
		}
		if (doc._mote_id) return false;
		if (this.cap_size && docs.length === this.cap_size) this.remove(docs[0]);

		doc._mote_id = this._generate_mote_id();
		docs.push(doc.clone());
		this.publish('change.insert', doc);
		return doc;
	},

	update: function(doc) {

		var index;

		if (!this.validate(doc)) {
			this.publish('error.update', this.errors);
			return false;
		}

		if (!doc._mote_id) return false;

		index = this.index_of(doc);
		if (index > -1) {
			this.documents.splice(index, 1, doc.clone());
			this.publish('change.update', doc);
			return doc;
		}
		else return false
	},

	remove: function(doc) {

		if (typeof doc === 'string') {
			doc = this.find_one({ _mote_id: doc });
		}

		if (!doc._mote_id) return false;

		var index = this.index_of(doc);
		if (index > -1) {
			var removed = this.documents.splice(index, 1);
			this.publish('change.remove', removed[0]);
			return this.documents.length;
		}
		else return false;
	},
	
	validate: function() { return true },
	
	collapse: function() {

		var docs = this.documents,
			collapsed = [],
			len = docs.length,
			i = 0;

		for (; i < len; i++) {
			collapsed.push(docs[i].collapse());
		}
		
		return collapsed;
	},

	_generate_mote_id: function() {
		var count = 0;
		return function() {
			return (count++).toString();
		}
	}()
}

/**
 *
 *
 *
 */
Mote.Document = {

	save: function() {
		var saved = this[this._mote_id ? 'update' : 'insert']();
		saved ? this.publish('change.save', this) : this.publish('error.save', this.collection.errors);
		return saved;
	},

	insert: function() {
		var inserted = this.collection.insert(this);
		inserted ? this.publish('change.insert', this) : this.publish('error.insert', this.collection.errors);
		return inserted;
	},

	update: function() {
		var updated = this.collection.update(this);
		updated ? this.publish('change.update', this) : this.publish('error.update', this.collection.errors);
		return updated;
	},

	collapse: function() {

		var data = this.data,
		    keys = this.collection.keys,
		    collapsed = {},
		    key;

		for (key in data) {
			if (keys.indexOf(key) === -1) continue;
			collapsed[key] = typeof data[key].collapse === 'function' ? data[key].collapse() : data[key];
		}

		return collapsed;
	},

	to_json: function() {
		var collapsed = this.collapse();
		return JSON.stringify(collapsed);
	},
	
	clone: function() {
		var clone = new this.collection.Document(this.data);
		clone._mote_id = this._mote_id;
		return clone;
	}
}


/**
 *
 *
 *
 */
Mote.Publisher = function() {
	this.subscriptions = { '*': [] };
}

Mote.Publisher.prototype = {

	subscribe: function(topic, fn, scope) {
		
		if (typeof topic === 'function') {
			scope = fn;
			fn = topic;
			topic = '*';
		}

		fn.scope = scope || this;
		(this.subscriptions[topic] || (this.subscriptions[topic] = [])).push(fn);
	},
	
	publish: function(topic, data) {

		var subs = (this.subscriptions[topic] || []).concat(this.subscriptions['*']),
		    nss = topic.split('.'),
		    len = subs.length,
	        i = 0;

		while (nss[0]) subs.concat(this.subscriptions[nss.shift()] || []);

		for (; i < len; i++) subs[i].call(subs[i].scope || this, data, this);
	}
}




/**
 *
 *
 */
Mote.Naming = {

    singular: [],
    plural: [],
    
    register: function(s, p) {
        this.singular.push(s);
        this.plural.push(p);
    },
    
    singularize: function(name) {
        var index = this.plural.indexOf(name);
        return index > -1 ? this.singular[index] : name.replace(/s$/, '');
    },
    
    pluralize: function(name) {
        var index = this.singular.indexOf(name);
        return index > -1 ? this.plural[index] : (name + 's');
    }
}

/**
 *
 */
Mote.EmbeddedDocuments = function(col) {};

Mote.EmbeddedDocuments.prototype = {

    embeds_many: function(col) {
		var name = col.name;
		this.keys.push(name);
		this.Document.initial.data[name] = col;
    },
    
    embeds_one: function(col) {
		var name = Mote.Naming.singularize(col.name)
		this.keys.push(name);
		col.cap_size = 1;
		this.Document.initial.data[name] = col;
    }
}

Mote.EmbeddedDocuments.document_prototype = {
	
	embed: function(doc) {

		var col_name = doc.collection.name,
		    doc_name = Mote.Naming.singularize(col_name),
		    keys = this.collection.keys,
		    len = keys.length,
		    i = 0,
		    key;

		for (; i < len; i++) {
			key = keys[i];
			if (key === col_name || key === doc_name) {
			    return this.data[key].insert(doc);
			}
		}
		
		return false;
	}
};

Mote.Remote = function(col) {

	// use something predefined or try to grab something jquery-ish
	Mote.Remote.ajax || (Mote.Remote.ajax = ($) ? $.ajax : new Error('Mote.Remote requires an AJAX utitlity'));
	
	this.action_config = {
		base_uri: '',
		success: function(data) { col.publish('remote.success.' + this.name, data) },
		error: function(data) { col.publish('remote.error.' + this.name, data) }
	};
}

Mote.Remote.prototype = {

	generate_actions: function(temps) {
		var name;
		for (name in temps) this.generate_action(name, temps[name]);
	},

	generate_action: function(name, temp) {

		var self = this,
		    action = new Mote.Remote.Action(name, temp, this.action_config);
		
		this[name] = function() { action.fire(arguments) };
	}	
}

Mote.Remote.Action = function(name, temp, config) {

	this.name = name;
	
	var parts = temp.split(' ');
	this.method = parts[0];
	this.template = parts[1];

	this.params = this.template.match(/\:\w*/) || [];
	
	Mote.Util.extend(this, config);
}

Mote.Remote.Action.prototype = {
	
	fire: function(args) {

		var request = this._generate(args),
			self = this;

		Mote.Remote.ajax({
			url: request.uri,
			type: request.method,
			data: request.data,
			contentType: request.content_type,
			success: function() {
				request.success.apply(self, arguments);
			},
			error: function() {
				request.error.apply(self, arguments);
			}
		});
	},

	_generate: function(args) {

		var request = {};

		request.params = [].slice.call(args, 0);
		request.data = (this.params.length < request.params.length) ? request.params.pop() : {};
		request.success = this.success;
		request.error = this.error;
		
		this._decorate_uri(request);

		return request;
	},

	_decorate_uri: function(request) {

		var uri = this.template,
		    request_params = request.params,
		    action_params = this.params,
		    len = action_params.length,
		    i = 0;

		for (; i < len; i++) uri = uri.replace(action_params[i], request_params[i]);

		if (this.base_uri) uri = this.base_uri + uri;
		
		request.uri = uri;
	}
}

/**
 *
 *
 */
Mote.Util = {
	
	is_defined: function(subject) { return subject !== undefined && subject !== null },

	is_array: function(subject) { return subject.constructor.toString().indexOf('Array') > -1 },

	is_object: function(subject) { return subject && typeof subject === 'object' && typeof subject.length === 'undefined' },

	clone: function() {
		var F = function() {};
		return function(o) {
			F.prototype = o;
			return new F;
		}
	}(),

	extend: function(dest, src, deep) {
		
		if (!src) return dest;
		
		var needs_recursive = false,
		    key,
		    prop,
		    util = Mote.Util;

		for (key in src) {
			prop = src[key];

			if (!util.is_defined(prop)) continue;

			if (deep) {
				
				needs_recursive = true;
				if (util.is_array(prop)) dest[key] = [];
				else if (util.is_object(prop)) dest[key] = {};
				else needs_recursive = false;
			}

			dest[key] = (needs_recursive) ? util.extend(dest[key], prop, true) : prop;
		}

		return dest;
	}
};