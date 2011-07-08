tba.Trip = function(data) {
  Remotely.decorate(this);
  
  this.name = '';
  this.locations = [];
  this.transits = [];
  
  this.keys = [
    'name',
    'locations',
    'transits'
  ];
}

tba.Trip.prototype = {
    
};