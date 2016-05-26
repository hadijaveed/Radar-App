getEvents = function(queryObj, city, cb) {
  let eventsIds = [],
      getAllEvents = function(query) {
        FBGraph.get(query, function(err, res) {
          if (err) return cb && cb(err);
          _.each(res.data, (r) => {
            if (r.place && r.place.location)
              eventsIds.push(r.id);
          });
          if (res.paging && res.paging.next) {
            getAllEvents(res.paging.next);
          } else {
            cb && cb(null, eventsIds);
          }
            
        });
      
      };
    
  FBGraph.search(queryObj, function(err, res) {
    if (err) return cb && cb(err);
    _.each(res.data, (r) => {
      if (r.place && r.place.location && r.place.location.city && r.place.location.city === city)
        eventsIds.push(r.id);
    });
    if (res.paging && res.paging.next) {
      getAllEvents(res.paging.next);
    } else {
      cb && cb(null, eventsIds);
    }
  });
  
};

getEventFromId = function(id, cb) {
  let query = id + '?fields=cover, category, name, place, type, start_time, end_time, declined_count, maybe_count, attending_count, description';
  FBGraph.get(query, function(err, res) {
    if (err) return console.log(err);
    cb && cb(res);
  });
};