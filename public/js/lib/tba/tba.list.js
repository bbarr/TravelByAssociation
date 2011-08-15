tba.List = function(name, container) {
  
  this.name = name;
  this.container = container;
  this.$container = $(container);
  
  this._build();
  this._bind();
}

tba.List.prototype = {
  
  add: function(data) {
    var html = this._create_item(data);
    this.$form.before(html);
  },
  
  remove: function(el) {
    this.container.removeChild(el[0] || el);
  },
  
  _bind: function() {
    
    var self = this;
    
    this.$form.delegate('input', 'blur', function(e) {
      var value = e.target.value;
      self.add(value);
      e.target.value = '';
    });
    
    this.$container.delegate('.remove', 'click', function(e) {
      e.preventDefault();
      var item = $(e.target).parent('li');
      self.remove(item);
    });
  },
  
  _build: function() {
    var form = this._create_form();
    form = form.childNodes[0];
    form = this.form = this.container.appendChild(form);
    this.$form = $(form);
  },
  
  _create_item: function(data) {
    return Marker.render(this.name + '_item', data);
  },
  
  _create_form: function() {
    return Marker.render(this.name + '_form');
  }
}