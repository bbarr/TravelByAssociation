tba.app = Fugue.create('app', document.body, {

  events: {},

  init: function() {
    this.trip = new tba.Trip();
    this.trip.subscribe('download_success', function(data) {
      this.publish('ready');
    }, this);
  },
	
  refresh: function() {

    var hash = window.location.hash,
        id = (hash) ? hash.substr(1) : false;

    if (id) {
        this.trip.download(id);
    }
    else {
        this.publish('ready');
    }
  }		
});