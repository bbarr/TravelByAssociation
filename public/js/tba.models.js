tba.models = {};

tba.models.Trip = function(data) {
  
  Remotely.decorate(this);
  this.generate_crud('trips');

  this.name = '';
  this.locations = [];  
  this.transits = [];
  this.associates = [];
}

tba.models.Trip.prototype = {

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

tba.models.Transit = function() {
  this.needs = [];
};

tba.models.Transit.prototype = {
   
   collapse: function() {
     
     var self = this;
     
     return {
       date: self.date,
       means: self.means,
       needs: self.needs
     }
   }
}

tba.models.Need = function() {
  
};

tba.models.Need.prototype = {
  
  collapse: function() {
    
    var self = this;
    
    return {
      solutions: self.solutions
    }
  }
}

tba.models.Location = function() {
  this.needs = [];
};

tba.models.Location.prototype = {
  
  collapse: function() {
    
    var self = this;
    
    return {
      needs: self.needs
    }
  }
}

tba.models.Associate = function() {
  this.name = '';
}

tba.models.Associate.prototype = {
  
  collapse: function() {
    
    var self = this;
    
    return {
      name: self.name
    }
  }
}