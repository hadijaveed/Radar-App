

User = Astro.Class({
  name: 'User',
  collection: Meteor.users,
  fields: {
    createdAt: Date,
    services: { type: 'object', default() { return {}; } },
    profile: {
      name: { type: 'string', default: '' },
      loc: { type: 'object', index: '2dsphere', default() { return {}; }},
      default() {
        return {};
      }
    }
  }
});

