tba.Trip = function(data) {

  this.remote = new Remotely.Obj();  
  this.remote.generate_crud();

  this.name = '';
  this.locations = new Remotely.Collection();
  this.transits = new Remotely.Collection();
}

tba.Trip.prototype = {
  
  
};