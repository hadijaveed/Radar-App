Template.user_data.onCreated(function() {
  let self = this;
  this.subscribe('userNotifications');
});

Template.user_data.helpers({
  notifications() {
    return Notifications.find({}, { created_at: -1 });
  }
});

Template.user_data.events({
  'click a.header'(e, tpl) {
    Notifications.update({ _id : this._id}, { $set: { is_read: true } });
    console.log('this', this._id);
  }
});