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

	Mote.Util.extend(self, new Mote.Publisher);
	Mote.Util.extend(self, Mote.Collection.prototype);

	self.length = 0;
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
				if (queries[key] === '*' || doc.data[key] != queries[key]) {
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
		if (!this.validate(doc)) return false;
		if (doc._mote_id) return false;
		doc._mote_id = this._generate_mote_id();
		this.documents.push(doc.clone());
		return doc;
	},

	update: function(doc) {
		if (!doc._mote_id) return false;
		var index = this.index_of(doc);
		if (index > -1) {
			this.documents.splice(index, 1, doc.clone());
			return doc;
		}
		else return false
	},

	remove: function(doc) {
		if (doc._mote_id) return false;
		var index = this.index_of(doc);
		if (index > -1) {
			this.documents.splice(index, 1);
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
		return this.collection[this._mote_id ? 'update' : 'insert'](this);
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
	
	subscribe: function(topic, fn) {
		
		if (typeof topic === 'function') {
			fn = topic;
			topic = '*';
		}
		
		(this.subscriptions[topic] || (this.subscriptions[topic] = [])).push(fn);
	},
	
	publish: function(topic, data) {

		var subs = (this.subscriptions[topic] || []).concat(this.subscriptions['*']),
			len = subs.length,
			i = 0;

		for (; i < len; i++) subs[i](data);
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
			    return doc.save();
			}
		}
		
		return false;
	}
};



/**
 *
 *
 *
 */
Mote.Remote = function(col) {
	
	// use something predefined or try to grab something jquery-ish
	Mote.Remote.ajax || (Mote.Remote.ajax = ($) ? $.ajax : function() { return true; });
	this.base_uri = '';
}

Mote.Remote.prototype = {
	
	_append_segments: function(uri, segments) {
		return uri.concat(segments);
	},

	_append_query: function(uri, query) {
		
		var query_string = '?',
	 	    key;

		for (key in query) query_string += (key + '=' + query[key].toString() + '&');

		query_string = query_string.substr(0, query_string.length - 1);
		uri.push(query_string);

		return uri;
	},
		
	generate_uri: function(segments, query) {	

		var uri = [this.base_uri, this.name];

		if (segments) {
			
			if (query) {
				uri = this._append_segments(uri, segments);
				uri = this._append_query(uri, query);
			}
			else {
				if (segments[0]) uri = this._append_segments(uri, segments);
				else uri = this._append_query(uri, segments);
			}
		}

		return uri.join('/');
	},

	query: function(query, cb) {
		this.subscribe('query_success', cb);
		this._make_request('query', 'GET', this.generate_uri(query));
	},
	
	fetch: function(_id, cb) {
		this.subscribe('fetch_success', cb);
		this._make_request('fetch', 'GET', this.generate_uri(_id));
	},
	
	persist: function(doc) {
		
		var method,
		    url,
		    mongo_id = doc.get_mongo_id();

		if (mongo_id) {
			method = 'PUT';
			url = this.generate_uri(mongo_id);
		}
		else {
			method = 'POST';
			url = this.generate_uri();
		}

		this._make_request('persist', method, url, doc.to_json());
	},
	
	_make_request: function(action, method, url, data) {

		var self = this,
			request = {
				url: url,
				method: method,				
				success: function(data) { self.publish(action + '_success', data) },
				error: function(xhr) { self.publish(action + '_error', xhr) },
				complete: self.dequeue
			};
			
		if (data) {
			request.data = data;
			request.contentType = 'application/json';
		}

		Mote.Remote.ajax(request);
	}
}

Mote.Remote.document_prototype = {
	
	persist: function() {
		if (!this.save()) return false;
		this.collection.persist(this);
	},
	
	get_mongo_id: function() {
		if (this.data['_id']) return this.data['_id']['$oid'];
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