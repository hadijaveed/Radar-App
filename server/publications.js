Meteor.publish('events', function(lng, lat, radius) {
  console.log(lng, lat, radius);
  return [Event.find({
    loc: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: radius * 1000,
      }
    }
  })];
});

Meteor.publish('fbEvents', function(lng, lat, radius) {
  console.log(lng, lat, radius);
  return [FbEvent.find({
    loc: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: radius * 1000,
      }
    }
  })];
});



