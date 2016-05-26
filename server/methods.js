import Fiber from 'fibers';

Meteor.methods({
  addEvent(eventObj) {
    Event.insert(eventObj);
  },
  
  getFbEvents(city) {
    this.unblock();
    FBGraph.setAccessToken(Meteor.user().services.facebook.accessToken);
    let timeNow = new Date(),
        momentInstance = moment(timeNow),
        queryObj = {
      q: city,
      type: 'event',
      since: momentInstance.toDate().toString(),
      until: momentInstance.add(1, 'year').toDate().toString()
      
      // center: [31.4834441, 74.0460169],
      // distance: 3000
    };
    
    let queryFacebook = function(queryObj, city) {
      getEvents(queryObj, city, function(err, eventIds) {
        if (err) {
          console.log(err);
          throw new Meteor.Error('fbEventError', err);
        }     
        console.log('event id length', eventIds.length);
        
        _.each(eventIds, (id) => {
          getEventFromId(id, function(res) {
            // console.log(res);
            let eventObj = {
              event_id: res.id,
              loc: {
                type: 'Point',
                coordinates: [res.place.location.longitude, res.place.location.latitude]
              },
              city: res.place.location.city,
              venue: res.place.name,
              zip_code: res.place.location.zip,
              event_name: res.name,
              event_description: res.description,
              type: res.type,
              declined_count: res.declined_count,
              maybe_count: res.maybe_count,
              attending: res.attending_count,
              start_time: res.start_time,
              end_time: res.end_time
            };
            
            if (res.cover && res.cover.source)
              _.extend(eventObj, { cover_url: res.cover.source });
            
            /* To bind meteor environment in a callback */
            Fiber(function() {
              
              if (Event.find({ event_id: id }).count() >= 1) {
                Event.update({ event_id: id }, eventObj);
              } else {
                Event.insert(eventObj);
              }
              
            }).run();

          });
        });
      });
    };
    
    return queryFacebook(queryObj, city);

  },
  
  userNearByEvents(coords, userId) {
    console.log('check user nearby events ');
    this.unblock();
    let eventsNearUser = Event.find({
      loc: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coords
          },
          $maxDistance: 10000,
        }
      }
    }).fetch();
    
    _.each(eventsNearUser, (event) => {
      if (Notification.find({ _id: event._id }).count() >= 1) {
        Notification.update({ event_id: event._id}, {
          $push: { users_nearby: userId }
        });
      } else {
        let eventObj = {
          event_id: event._id,
          event_title: event.event_name,
          location_venue: event.venue,
          users_nearby: [userId]
        };
        if (event.cover_url)
          eventObj.cover_url = event.cover_url;
        Notification.insert(eventObj);
      }
      
    });
  },
  
  addUsersNotifications(event, eventId) {
    console.log('add user notifications gets callled ');
    this.unblock();
    let users = User.find({
      'profile.loc': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: event.loc.coordinates
          },
          $maxDistance: 10000
        }
      }
    }).fetch();
    
    console.log('see users here ', users);
    
    _.each(users, (user) => {
      if (Notification.find({ event_id: eventId }).count() >= 1) {
        Notification.update({ event_id: eventId }, {
          $push: { users_nearby: user._id }
        });
      } else {
        let eventObj = {
          event_id: eventId,
          event_title: event.event_name,
          location_venue: event.venue,
          users_nearby: [user._id]
        };
        
        if (event.cover_url)
          eventObj.cover_url = event.cover_url;
        Notification.insert(eventObj);
      }
    });
  },
   
  addUserCurrentLocation(lng, lat) {
    User.update({ _id: Meteor.userId() }, {
      $set: {
        'profile.loc' : {
         type: 'Point',
         coordinates: [lng, lat]
        }
      }
    });
  }
  
});

Event.find({}).observeChanges({
  added(id, event) {
    
    // to make it a asynch method
    Meteor.call('addUsersNotifications', event, id, function() {
      
    });
  }
});

Meteor.users._ensureIndex({ 'profile.loc': '2dsphere' });


/* If a user changes his location */
// Meteor.users.find({}).observeChanges({
//   changed(id, user) {
//     console.log('user have been changed ');
//   }
// });


