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
	this.name = '';
	this.keys = [];

	this.documents = {};
	this.Document = function(data) {
		var extend = Mote.Util.extend;
		this.name = Mote.Naming.singularize(self.name);
		this.collection = self;
		extend(this, self.Document.initial, true);
		extend(this, data);
	}

	this.Document.initial = {};
	this.Document.prototype = Mote.Util.clone(Mote.DocumentPrototype);
	
	// run user provided initialization
	block.call(this, this);

	if (this.name === '') throw new Exception('Collection requires a name');
}

Mote.Collection.prototype = {
	
	use: function(Feature, block) {

		var feature = new Feature(this);

		// optional custom init
		if (block) block.call(this, feature);

		Mote.Util.extend(this, feature);
	},
	
	uid: function() {
		var count = 0;
		return function() {
			return (count++).toString();
		}
	}(),
	
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
				if (doc[key] != queries[key]) {
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
		var matches = this.find(query, 1);
		return matches[0];
	},
	
	contains: function(doc) {
		if (!doc._mote_id) return false;
		return !!this.documents[doc._mote_id];
	},
	
	save: function(doc) {
		if (!this.validate(doc)) return false;
		doc._mote_id || (doc._mote_id = this.uid());
		this.documents[doc._mote_id] = doc;
		return doc._mote_id;
	},
	
	validate: function() { return true }
}

Mote.DocumentPrototype = {

	save: function() {
		return this.collection.save(this);
	},

	to_json: function() {
		
		var keys = this.collection.keys,
		    json = {},
		    key,
		    prop;

		for (key in this) {
			if (keys.indexOf(key) > -1) {
				prop = this[key];
				prop = prop.to_json ? prop.to_json() : prop;
				json[key] = prop;
			}
		}
		
		return JSON.stringify(json);
	},
	
	clone: function() {
		var clone = {};
		Mote.Util.extend(clone, this, true);
		return clone;
	}
}

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

Mote.EmbeddedDocuments = function(col) {
	
	Mote.Util.extend(col.Document.prototype, {
		
		embed: function(doc) {

			var doc_name = doc.name,
			    col_name = doc.collection.name,
			    keys = this.collection.keys,
			    len = keys.length,
			    i = 0,
			    key;

			for (; i < len; i++) {
				key = keys[i];
				if (key === doc_name) {
  				    this[key] = doc;
			    }
				else if (key === col_name) {
				    this[key].push(doc);
				}
			}
		}
	});
};

Mote.EmbeddedDocuments.prototype = {

    embeds_many: function(col) {
		var name = col.name;
		this.keys.push(name);
		this.Document.initial[name] = [];
    },
    
    embeds_one: function(col) {
		var name = Mote.Naming.singularize(col.name)
		this.keys.push(name);
		this.Document.initial[name] = {};
    }
}

Mote.REST = function(col) {
	
	this.base_uri = '';
	this.ajax = ($) ? $.ajax : function() { return true; };
	
	Mote.Util.extend(col.Document.prototype, {
		
		persist: function() {

			var self = this,
				col = this.collection,
			    method,
			    url;

			if (this['_id']) {
				method = 'PUT';
				url = col.generate_uri(this['_id']);
			}
			else {
				method = 'POST';
				url = col.generate_uri();
			}

			col.ajax({
				url: url,
				data: self.to_json(),
				contentType: 'application/json',
				type: method,
				success: function(data) {
					
				}
			});
		}
	});
}

Mote.REST.prototype = {
	
	_append_segments: function(uri, segments) {
		return uri.concat(segments);
	},

	_append_query: function(uri, query) {
		
		var query_string = '?',
	 	    key;

		for (key in query) query_string += (key + '=' + query[key].toString() + '&');

		query_string = query_string.substr(0, query_string.length - 1);
		uri.append(query_string);
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
		var self = this;
		this.ajax({
			url: self.collection.generate_uri(query),
			method: 'GET',
			success: function(data) {
				cb(data);
			}
		});
	},
	
	fetch: function(_id, cb) {
		var self = this;
		this.ajax({
			url: self.generate_uri(_id),
			method: 'GET',
			success: function(data) {
				cb(data);
			}
		});
	}
}

Mote.Util = {
	
	extend: function(dest, src) {
		for (var key in src) dest[key] = src[key];
		return dest;
	},

	is_defined: function(subject) { return subject !== undefined && subject !== null },

	is_array: function(subject) { return subject.constructor.toString().indexOf('Array') > -1 },

	is_object: function(subject) { return subject && typeof subject === 'object' && typeof subject.length === 'undefined' },

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
	},
	
	clone: function() {
		var F = function() {};
		return function(o) {
			F.prototype = o;
			return new F;
		}
	}()
};