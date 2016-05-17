Events = new Mongo.Collection('events');

Event = Astro.Class({
  name: 'Event',
  collection: Events,
  fields: {
    posted_by: { type: 'string' },
    loc: { type: 'object', index: '2dsphere', default() { return {}; } },
    location_name: { type: 'string' },
    event_title: { type: 'string'},
    event_description: { type: 'string' },
    event_images: { type: 'array', default() { return []; }},
    keywords: { type: 'array'}
  },
  
  behaviors: {
    timestamp: {
      hasCreatedField: true,
      createdFieldName: 'created_at',
      hasUpdatedField: true,
      updatedFieldName: 'updated_at'
    }
  }

});