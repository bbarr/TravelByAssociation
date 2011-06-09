
var Mote = {};

Mote.Collection = function(block) {
	
	var self = this;
	
	if (typeof block === 'undefined') throw new Exception('Collection requires an initialize function');
	
	this._document_prototype = {};
	this.documents = [];
	this.Document = function(data) {
		return Mote.Util.extend(new Mote.Document(data, self), self._document_prototype);
	};
	
	// run user provided initialization
	block.call(this);
	
	if (typeof this.name === 'undefined') throw new Exception('Collection requires a name');
}

Mote.Collection.prototype = {
	
	use: function(Feature, block) {
		
		var util = Mote.Util,
			feature = new Feature;

		if (block) block(feature);
	
		if (feature.document) {
			util.extend(this._document_prototype, feature.document);
		}
		
		if (feature.collection) {
			util.extend(this, feature.collection);
		}
		
	},
	
	uid: function() {
		var count = 0;
		return function() {
			return count++;
		}
	}(),
	
	find: function(queries, limit) {

		var docs = this.documents,
			matches = [],
			len = docs.length,
			i = 0,
			key,
			match;
			
		for (; i < len; i++) {
			
			doc = docs[i];
			match = true;			
			
			for (key in queries) {
				if (doc.data[key] != queries[key]) {
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
	
	index_of: function(doc) {
		
		var docs = this.documents,
			len = docs.length,
			i = 0,
			index = -1;
			
		for (; i < len; i++) {
			if (docs[i].id === doc.id) {
				index = i;
				break;
			}
		}
        
		return index;
	},
	
	insert: function(doc) {
	    if (!doc.is_new) return false;
	    if (!this.validate(doc)) return false;
	    doc.is_new = false;
		doc.id = this.uid();
		this.documents.push(doc.copy());
	},
	
	update: function(doc) {
    	if (doc.is_new) return false;
    	if (!this.validate(doc)) return false;
    	
		var index = this.index_of(doc);
		this.documents.splice(index, 1, doc.copy());
	},
	
	validate: function() { return true }
}

Mote.Document = function(data, collection) {
	this.collection = collection;
	this.name = Mote.Naming.singularize(collection.name);
	this.is_new = true;
	this.errors = {};
	this.data = {};
	
	this.load(data);
}

Mote.Document.prototype = {
	
	load: function(attrs) {
		var data = this.data;
		for (var key in attrs) data[key] = attrs[key];
	},
	
	save: function() {
	    var col = this.collection;
	    return this.is_new ? col.insert(this) : col.update(this);
	},

	copy: function() {
		var doc = new Mote.Document(this.data, this.collection);
        doc.id = this.id;
        doc.is_new = this.is_new;
		return doc;
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

Mote.EmbeddedDocuments = function() {
	
	this.collection = {
        
        embeddable: {
            many: [],
            one: []
        }, 
        
        embeds_many: function(col) {
            this.embeddable.many.push(col);
			this._document_prototype[col.name] = [];
        },
        
        embeds_one: function(col) {
            this.embeddable.one.push(col);
			var doc_name = Mote.Naming.singularize(col.name);
			this._document_prototype[doc_name] = {};
        }
    };
    
    this.document = {
        
        embed: function(doc) {

			var plural = Mote.Naming.pluralize(doc.name);
				
			if (this[doc.name]) {
				this[doc.name] = doc;
			}
			else if (this[plural]) {
				this[plural].push(doc);
			}
        }	
    }
};

Mote.REST = function() {

	this.base_uri = '';
	this.ajax = $.ajax;

	this.collection = {
	
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

			if (query) {
				uri = this._append_segments(uri, segments);
				uri = this._append_query(uric, query);
			}
			else {
				if (segments[0]) uri = this._append_segments(uri, segments);
				else uri = this._append_query(uri, segments);
			}

			return uri.join('/');
		},

		query: function(query) {
			var self = this;
			this.ajax({
				url: self.collection.generate_uri(query),
				method: 'GET',
				complete: function(data) {
					console.log(data);
				}
			});
		}
	}
	
	this.document = {
	  
		remote_load: function(_id) {
			var self = this;
			this.ajax({
				url: self.collection.generate_uri(_id),
				method: 'GET',
				complete: function(data) {
					console.log(data);
				});
			});
		},
		
		persist: function() {

			var self = this,
			    method,
			    url;

			if (this.is_persisted()) {
				method = 'PUT';
				url = this.collection.generate_uri(this.data['_id']);
			}
			else {
				method = 'POST';
				url = this.collection.generate_uri();
			}

			this.ajax({
				url: url,
				data: self.data,
				type: method,
				complete: function(data) {
					console.log(data);
				}
			});
		}
	}
}

Mote.Util = {
	
	extend: function(dest, src) {
		for (var key in src) dest[key] = src[key];
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