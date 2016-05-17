FbEvents = new Mongo.Collection('fb_events');

FbEvent = Astro.Class({
  name: 'FbEvent',
  collection: FbEvents,
  fields: {
    event_id: { type: 'string' },
    cover_url: { type: 'string', default: '' },
    loc: { type: 'object', index: '2dsphere', default() { return {}; } },
    city: { type: 'string' },
    venue: { type: 'string' },
    zipCode: { type: 'number' },
    event_name: { type: 'string' },
    event_description: { type: 'string' },
    type: { type: 'string'},
    declined_count: { type: 'number' },
    attending: { type: 'number' },
    maybe_count: { type: 'number' },
    start_time: { type: 'date' },
    end_time: { type: 'date' }
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