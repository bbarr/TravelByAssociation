Marker.register('itinerary_form', function() {
  this
    .li()
      .input({ type: 'text' });
});

Marker.register('itinerary_item', function(content) {
  this
    .li()
      .text(content)
      .a({ href: '#', 'class': 'remove' })
        .text('x')
});