tba.Trip = function(data) {
  Remotely.decorate(this);
  this.generate_crud('trips');

  this.name = '';
  this.locations = new Remotely.Collection();
  this.transits = new Remotely.Collection();
}

tba.Trip.prototype = {
  
  collapse: function() {
    return this;
  }
};