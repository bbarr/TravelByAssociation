tba.fb = Fugue.create('fb', document.body, {

	events: {
	  '.login click': function(e) {
	    e.preventDefault();
	    FB.login(function(response) {
	      if (response.session) console.log(response);
	      else console.log('fail!')
	    });
	  }
	},

  init: function() {
    this._bind();
    this._render();
  },
  
  _bind: function() {
    
    window.fbAsyncInit = function() {
      FB.init({
        appId: '166313103437724', 
        status: false, 
        cookie: true,
        xfbml: false
      });
    };
  },
  
  _render: function() {
    
    var root = $.build('div', { id: 'fb-root' },
      $.build('script', {
        src: document.location.protocol + '//connect.facebook.net/en_US/all.js',
        async: true
      })
    );
    
    this.$container.append(root);
  }
});