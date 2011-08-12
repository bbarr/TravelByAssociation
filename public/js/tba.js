var tba = {
  
  ENVIRONMENT: 'development',
  
  log: function() {
    if (this.ENVIRONMENT !== 'development' || typeof console === 'undefined') return;
    console.log.apply(console, arguments);
  }
};