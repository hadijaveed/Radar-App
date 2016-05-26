Notifications = new Mongo.Collection('notifications');

Notification = Astro.Class({
  name: 'Notification',
  collection: Notifications,
  fields: {
    event_id: { type: 'string', default: '' },
    cover_url: { type: 'string', default: '' },
    event_title: { type: 'string' },
    location_venue: { type: 'string' },
    users_nearby: { type: 'array', default() { return []; }},
    is_read: { type: 'boolean', default: false }
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