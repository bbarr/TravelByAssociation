tba.Trip = function(data) {
  
  Remotely.decorate(this);
  this.generate_crud('trips');

  this.name = '';
  this.locations = [];  
  this.transits = [];
  this.associates = [];
}

tba.Trip.prototype = {

  collapse: function() {
    
    var self = this;
    
    return {
      name : self.name,
      locations: self.locations,
      transits: self.transits,
      associates: self.associates
    }
  }
};

tba.Transit = function() {
  this.needs = [];
};

tba.Transit.prototype = {
   
   collapse: function() {
     
     var self = this;
     
     return {
       date: self.date,
       means: self.means,
       needs: self.needs
     }
   }
}

tba.Need = function() {
  
};

tba.Need.prototype = {
  
  collapse: function() {
    
    var self = this;
    
    return {
      solutions: self.solutions
    }
  }
}

tba.Location = function() {
  this.needs = [];
};

tba.Location.prototype = {
  
  collapse: function() {
    
    var self = this;
    
    return {
      needs: self.needs
    }
  }
}

tba.Associate = function() {
  this.name = '';
}

tba.Associate.prototype = {
  
  collapse: function() {
    
    var self = this;
    
    return {
      name: self.name
    }
  }
}