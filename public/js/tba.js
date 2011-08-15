var tba = {
  
  ENVIRONMENT: 'development',
  MAP_DEFAULTS: {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    
    // turn off all ui elements
    disableDefaultUI: true,
    
    // pick which ones to use
    // zoomControl: true,
    // zoomControlOptions: {
    //   style: google.maps.ZoomControlStyle.LARGE,
    //   position: google.maps.ControlPosition.RIGHT_TOP
    // }
  },
  
  log: function() {
    if (this.ENVIRONMENT !== 'development' || typeof console === 'undefined') return;
    console.log.apply(console, arguments);
  }
};