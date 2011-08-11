tba.list = function(config) {
  this.item_template = config.item_template;
  this.list_template = config.list_template;
  this.container = config.container;
}

tba.list.prototype = {
  
  add: function(data) {
    var html = this.item_template(data);
    if (html) {
      
    }
  },
  
  remove: function() {
    
  },
  
  error: function() {
    
  },
  
  corrected: function() {
    
  }
}