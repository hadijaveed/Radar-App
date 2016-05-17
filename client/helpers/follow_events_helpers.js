

Template.follow_events.onCreated(function() {
  myTpl = this;
  let self = this;
  self.mapEl = null;
  self.markers = [];
  self.locationObj = new ReactiveDict();
  self.locationObj.setDefault({
    lat: 31.483673,
    lng: 74.1861192,
    zoom: 15,
    radius: 1,
    city: null
  });
  self.autorun(function() {
      
    self.subscribe('fbEvents', self.locationObj.get('lng'), self.locationObj.get('lat'), self.locationObj.get('radius'));
    if (self.subscriptionsReady() && GoogleMaps.loaded()) {
      let events = FbEvent.find().fetch();
      if (self.markers.length) {
        _.each(self.markers, (marker) => {
          marker.setMap(null);
        });
        self.markers = [];
      }
      _.each(events, (event) => {
        let latLng = new google.maps.LatLng(event.loc.coordinates[1], event.loc.coordinates[0]);
        
        // if the marker is on same location add offset
        _.each(self.markers, (marker) => {
          let previousPosition = marker.getPosition();
          if (latLng.equals(previousPosition)) {
            let newLat = latLng.lat() + (Math.random() - .5) / 1500,
                newLong = latLng.lng() + (Math.random() - .5) / 1500;
            latLng = new google.maps.LatLng(newLat, newLong);
          }
        });
        
        let marker = new google.maps.Marker({
          position:latLng,
          map: self.mapEl
        });
        
        let infoWindowHtml = '<div class="ui card">' +
        '<div class="content">' +
        '<div class="header">' + event.event_name + '</div>' +
        '<div class="meta">' + event.venue + '</div>' +
        '<div class="description">' + event.attending + '</div>' +
        '</div>' +
        '<div class="extra content">' +
        '<div class="ui basic green button" event-id="' + event._id + '">' + 'Follow </div>' +
        '</div>' +
        '</div>';
        
        let infoWindow = new google.maps.InfoWindow({ content: infoWindowHtml });
        marker.addListener('click', function() {
          infoWindow.open(self.mapEl, marker);
        });
        self.markers.push(marker);
      });
    }
  });
  
  // if the city is selected
  self.autorun(function() {
    if (self.locationObj.get('city') !== null) {
      Meteor.call('getFbEvents', self.locationObj.get('city'), function(err) {
        if (err) console.log('something went wrong ', err);
      });
    }
  });
    
});

Template.follow_events.helpers({
  events() {
    return FbEvent.find();
  },
  
  subscriptionsNotReady() {
    return (Template.instance().subscriptionsReady() === false);
  }
});

Template.follow_events.onRendered(function() {
  let self = this;
  GoogleMaps.load({ v: '3', libraries: 'places' });
  self.autorun(function() {
    if (GoogleMaps.loaded()) {
      self.mapEl = new google.maps.Map(document.getElementById('gmap'), {
        center: {lat: self.locationObj.get('lat'), lng: self.locationObj.get('lng')},
        zoom: self.locationObj.get('zoom')
      });
    }
  });
  
  navigator.geolocation.getCurrentPosition(function(pos) {
    self.locationObj.set('lat', pos.coords.latitude);
    self.locationObj.set('lng', pos.coords.longitude);
  });
  
  $.get('http://ipinfo.io', function(response) {
    console.log('check city ', response.city);
    self.locationObj.set('city', 'Lahore');
  }, 'jsonp');

  self.$('.ui.dropdown').dropdown({
    onChange(val) {
      let radius = parseFloat(val);
      self.locationObj.set('radius', radius);
      if (radius === 1) self.locationObj.set('zoom', 15);
      if (radius === 5) self.locationObj.set('zoom', 12);
      if (radius === 10) self.locationObj.set('zoom', 12);
      if (radius === 30) self.locationObj.set('zoom', 11);
      if (radius === 50) self.locationObj.set('zoom', 9);
      if (radius === 100) self.locationObj.set('zoom', 8);
    }
  });

});

Template.follow_events.events({

});