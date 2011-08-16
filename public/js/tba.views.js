Marker.register('itinerary_form', function() {
  this
    .li()
      .label('Add location to trip...').end()
      .input({ type: 'text', placeholder: 'eg: Boston, MA' });
});

Marker.register('itinerary_item', function(content) {
  this
    .li()
      .text(content)
      .a({ href: '#', 'class': 'remove' })
        .text('x')
});