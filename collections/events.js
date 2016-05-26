Events = new Mongo.Collection('events');

Event = Astro.Class({
  name: 'Event',
  collection: Events,
  fields: {
    event_id: { type: 'string', default: '' },
    cover_url: { type: 'string', default: '' },
    loc: { type: 'object', index: '2dsphere', default() { return {}; } },
    city: { type: 'string', default: '' },
    venue: { type: 'string', default: '' },
    zipCode: { type: 'number', default: 0 },
    event_name: { type: 'string' },
    event_description: { type: 'string' },
    type: { type: 'string', default: ''},
    declined_count: { type: 'number', default: 0 },
    attending: { type: 'number', default: 0 },
    maybe_count: { type: 'number', default: 0 },
    start_time: { type: 'date', default() { return []; } },
    end_time: { type: 'date', default() { return []; } },
    event_images: { type: 'array', default() { return []; }},
    keywords: { type: 'array', default() { return []; }},
    posted_by: { type: 'string', default: '' }
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

