Marker.register('itinerary_form', function() {
  this
    .li()
      .label('Add location to trip...').end()
      .input({ type: 'text', placeholder: 'eg: Boston, MA' });
});

Marker.register('itinerary_item', function(item) {
  this
    .li({ id: item.cid })
      .text(item.get('formatted_address'))
      .a({ href: '#', 'class': 'remove' })
        .text('x')
});

Marker.register('obtrusive_overlay', function(content) {
  this
    .div({ className: 'overlay hide' })
      .a({ href: '#', className: 'close' }).end()
      .partial(content);
});

Marker.register('challenge', function() {
  
  var q = [ Math.floor(Math.random() * 11), Math.floor(Math.random() * 11) ];
      a = q[0] + q[1];

  this
    .div({ id: 'challenge' })
      .form({ id: 'login', className: 'active' })
        .h3('Log in').end()
        .input({ type: 'text', name: 'email', placeholder: 'Email Address' }).end()
        .input({ type: 'password', name: 'password', placeholder: 'Password' }).end()
        .a({ href: '#'})
          .text('Submit')
        .end()
      .end()
      .form({ id: 'signup' })
        .h3('...Or sign up').end()
        .input({ type: 'text', name: 'email', placeholder: 'Email Address' }).end()
        .input({ type: 'password', name: 'password', placeholder: 'Password'  }).end()
        .input({ type: 'password', name: 'confirm_password', placeholder: 'Confirm Password'  }).end()
        .input({ type: 'text', name: 'r_u_bot', placeholder: 'What is ' + q[0] + ' + ' + q[1] + '?' }).end()
        .input({ type: 'hidden', name: 'r_u_bot_a', value: a }).end()
        .a({ href: '#' })
          .text('Submit')
        .end()
      .end()
    .end();  
});

Marker.register('header', function() {
  this
    .nav()
      .a({ href: '#', className: 'logout' })
        .text('Logout')
      .end()
      .a({ href: '#', id: 'how_it_works', title: 'How it works' })
        .text('?')
      .end()
    .end()
    .h1('TravelByAssociation');
});

Marker.register('location_overlay', function(loc) {
  
  this
    .div({ className: 'location_overlay' })
      .ul({ className: 'needs' }).end()
      .div({ className: 'suggestions' })
    
});

Marker.register('needs_form', function() {
  this
    .li()
      .label('Add need').end()
      .input({ type: 'text', placeholder: 'eg: A couch to crash on...' });
});

Marker.register('needs_item', function(item) {
  this
    .li({ id: item.cid })
      .text(item.get('text'))
      .a({ href: '#', 'class': 'remove' })
        .text('x')
});

Marker.register('suggestions', function() {
  
  this.div('suggestions');
});