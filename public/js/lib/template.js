var Template = function() {
	this.storage = document.createDocumentFragment();
	this.stack = [];
}

Template.prototype = {

	to_html: function() {

		while (this.stack[0]) {
			this.end();
		}

		var html = this.storage.cloneNode(true);
		this.storage = document.createDocumentFragment();

		return html;
	},

	place: function(el) {

		if (this.stack[0]) {
			this.stack[this.stack.length - 1].appendChild(el);
		}
		else {
			this.storage.appendChild(el);
		}

		this.stack.push(el);
	},

	end: function() {

		var last = this.stack.pop();

		if (!this.stack[0]) {
			this.storage.appendChild(last);
		}

		return this;
	},

	text: function(text) {

		var el = this.stack[this.stack.length - 1];
		this._append_content(el, text);

		return this;
	},

	_elements: [],
	
	_create_element: function(tag) {

		var els = this._elements;
		if (!els[tag]) els[tag] = (tag === 'fragment') ? document.createDocumentFragment() : document.createElement(tag);

		return els[tag].cloneNode(false);
	},

	_append_content: function(el, text) {
		(/\&\S+;/.test(text)) ? el.innerHTML += text : el.appendChild(document.createTextNode(text));
	},

	_append_styles: function(el, styles) {
		
		var name, style = el.style;
		for (name in styles) {
			style[name] = styles[name];
		}
	},

	_append_attributes: function(el, attrs) {
		
		var attr, name;
		for (name in attrs) {
			attr = attrs[name];
			switch(name) {
				case 'style': 
					this._append_styles(el, attr); 
					break;
				case 'class': 
					el.className = attr; 
					break;
				default:
					(typeof el[name] !== 'undefined') ? el[name] = attr : el.setAttribute(name, attr);
			}
		}
	}
};

(function() {

	var tags = [

		// text
		'p','h1','h2','h3','h4','h5','h6','strong','em','abbr','address','bdo','blockquote','cite','q','code','ins','del','dfn','kbd','pre','samp','var','br',

		// structure
		'div', 'span',

		// links
		'a', 'base',

		// images and objects
		'img','area','map','object','param',

		// lists
		'ul','ol','li','dl','dt','dd',

		// tables
		'table','tr','td','th','tbody','thead','tfoot','col','colgroup','caption',
		
		// forms
		'form','input','textarea','select','option','optgroup','button','label','fieldset','legend'
    	    ],
	    generate = function(tag) {

		Template.prototype[tag] = function(attrs, content) {

			var el = this._create_element(tag),
			    attrs_type = typeof attrs;

			if (content) {
				this._append_content(el, content);
			}

			if (attrs_type == 'string' || attrs_type == 'number') {
				this._append_content(el, attrs);
			}
			else {
				this._append_attributes(el, attrs);
			}

			this.place(el);

			return this;
	    	}
	    },
	    len = tags.length,
	    i = 0;

	for (; i < len; i++) {
		generate(tags[i]);
	}
})();
