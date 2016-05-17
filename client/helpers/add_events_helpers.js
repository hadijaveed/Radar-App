import Dropzone from 'dropzone';

Template.add_event.onCreated(function() {
  myTpl = this;
  let self = this;
  self.mapEl = null;
  self.markerEl = null;
  self.locationStuff = new ReactiveDict({});
  self.locationStuff.setDefault({
    lat: -34.397,
    lng: 150.644
  });
  
});


Template.add_event.onRendered(function() {
  console.log('in the add events here ');
  let self = this;
  self.$('[name="keywords"]').parent().dropdown({
    allowAdditions: true
  });
  GoogleMaps.load({ v: '3', libraries: 'places' });
  self.autorun(function() {
    if (GoogleMaps.loaded()) {
      console.log('google maps are loaded here ');
      self.mapEl = new google.maps.Map(document.getElementById('gmap'), {
        center: {lat: self.locationStuff.get('lat'), lng: self.locationStuff.get('lng')},
        zoom: 12
      });
      
      self.markerEl = new google.maps.Marker({
        position: { lat: self.locationStuff.get('lat'),
          lng: self.locationStuff.get('lng')
        },
        map: self.mapEl
      });
      
      self.$('[name="location"]').geocomplete().bind('geocode:result', function(event, result) {
        self.locationStuff.set('lat', result.geometry.location.lat());
        self.locationStuff.set('lng', result.geometry.location.lng());
      });
    }
  });
  
  /* See if user allows */
  navigator.geolocation.getCurrentPosition(function(pos) {
    self.locationStuff.set('lat', pos.coords.latitude);
    self.locationStuff.set('lng', pos.coords.longitude);
  });
  
  /* Add images here */
  self.imageDropzone = new Dropzone(self.$('#imageDrop').get(0), {
    url: '#',
    maxFiles: 15,
    allowMultiple: true,
    clickable: self.$('[name="addImages"]').get(0),
    thumbnailWidth: 259,
    thumbnailHeight: 259,
    previewsContainer: self.$('#imageDrop').get(0),
    previewTemplate: self.$('.image.preview.template').html(),
    accept(file, done) {
      acceptFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
      if (acceptFileTypes.indexOf(file.type) === -1) return done('image filetype not acceptable.');
      done();
    }
   
  });
});

Template.add_event.events({
  'click [name="addEvent"]'(e, tpl) {
    let eventObj = {
      posted_by: Meteor.userId(),
      loc: {
        type: 'Point',
        coordinates: [tpl.locationStuff.get('lng'), tpl.locationStuff.get('lat')]
      },
      location_name: $('[name="location"]').val(),
      event_title: $('[name="event_name"]').val(),
      event_description: $('[name="Description"]').val(),
      keywords: $('[name="keywords"]').val()
    };
    Meteor.call('addEvent', eventObj, function() {
      FlowRouter.go('/follow_events')
    });
  }
});