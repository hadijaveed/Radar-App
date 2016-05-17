import Fiber from 'fibers';

Meteor.methods({
  addEvent(eventObj) {
    Event.insert(eventObj);
  },
  
  getFbEvents(city) {
    this.unblock();
    FBGraph.setAccessToken(Meteor.user().services.facebook.accessToken);
    let queryObj = {
      q: city,
      type: 'event',
      
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
            console.log(res);
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
              
              if (FbEvent.find({ event_id: id }).count() >= 1) {
                FbEvent.update({ event_id: id }, eventObj);
              } else {
                FbEvent.insert(eventObj);
              }
              
            }).run();

          });
        });
      });
    };
    
    return queryFacebook(queryObj, city);

  }
  
});


