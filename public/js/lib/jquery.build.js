(function($) {
	
	// private
	var _util, _elements, _doc;
	
	// public
	var api;
	
	// shortcut to document
	_doc = document;
	
	// cache all elements here for cloning later
	_elements = {};
	
	_util = {
		
		/**
		 *  Creates Element and adds to storage or clones existing
		 * 
		 *  @param {String} tag
		 */
		new_element : function(tag) {
			if (!_elements[tag]) _elements[tag] = (tag === 'fragment') ? _doc.createDocumentFragment() : _doc.createElement(tag);
			return _elements[tag].cloneNode(false);
		},

		/**
		 *  Adds text to element 
		 *  - auto-detects HTML Entities and uses innerHTML to parse
		 * 
		 *  @param {HTMLElement} el
		 *  @param {String} string
		 */
		insert_text : function(el, text) {
			(/\&\S+;/.test(text)) ? el.innerHTML += text : el.appendChild(_doc.createTextNode(text));
		},
		
		/**
		 *  Loops through object of attributes and applies them
		 *
		 *  @param {HTMLElement} element to attribute-ize
		 *  @param {Object} attribute object to parse
		 */
		apply_attributes : function(el, attrs) {
			
			var $el = $(el);
			
			var attr;
			for (var name in attrs) {
				attr = attrs[name];
				switch(name) {
					case 'style' : $el.style(attr); break;
					case 'class' : el.className = attr; break;
					default : (typeof el[name] !== 'undefined') ? el[name] = attr : el.setAttribute(name, attr);
				}
			}
		},
		
		/**
		 *  Parses contents and adds according to whatever technique works best
		 *
		 *  @param {HTMLElement} element to add content to
		 *  @param {String|Number|Array|Function|HTMLElement|HTMLFragment|HTMLCollection} contents to parse and add
		 */
		process_contents : function(el, contents) {
			
			if (!$.isArray(contents)) {
				contents = [contents];
			}

			var content;
			for (var i = 0, len = contents.length; i < len; i++) {
				
				content = contents[i];
				
				if (typeof content === 'function') {
					// if content is a function
					
					el.appendChild(content());
				}
				else if (content.nodeType && (content.nodeType === 1 || content.nodeType === 11)) {
					// if content is an element or a document fragment
					
					el.appendChild(content);
				}
				else {
					// if it is string or number
					
					_util.insert_text(el, content);
				}
			}
		}
		
	}
	
	api = {
		
		/**
		 *  Builds and returns HTMLElement, with any content (including other 'built' elements)
		 *
		 *  Examples:
		 *  build('div', {'id' : 'container'}, 'a container')
		 *  => <div id="container">a container</div>
		 *
		 *  build('a', {'href' : '#'}, [
		 *    'click here,
		 *    build('span', 'a contained element')
		 *  ])
		 *  => <a href="#">click here<span>a contained element</span></a>
		 *
		 *  @param {String} element tag name
		 *  @param {Object} optional - HTML attributes
		 *  @param {String|Number|Array|HTMLElement} optional - contents, or list of content
		 */
		build : function(tag, attrs, contents) {

			// make element available for util functions
			var el = _util.new_element(tag);
			
			// if attrs is attrs object, otherwise its content
			if ($.isPlainObject(attrs)) {
				_util.apply_attributes(el, attrs);
			}
			else {
				contents = attrs;
			}
			
			if (contents) {
				_util.process_contents(el, contents);
			}
			
			return el;
		}
	}
	
	$.extend(api);
	
})(jQuery);