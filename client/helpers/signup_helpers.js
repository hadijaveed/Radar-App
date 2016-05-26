Template.login.onCreated(function() {
  if (Meteor.userId()) FlowRouter.go('/home');
});

Template.login.events({
  'click [name="loginWithFacebook"]'(e, tpl) {
    Meteor.loginWithFacebook({}, (err, u) => {
      if (err) {
        throw new Meteor.Error('Login Failed');
      } else {
        navigator.geolocation.getCurrentPosition(function(pos) {
          Meteor.call('addUserCurrentLocation', pos.coords.longitude, pos.coords.latitude, function() {
            FlowRouter.go('/home');
          });
        }, function(err) {
          if (err) console.error(err);
        }, { maximumAge:Infinity, timeout: 10000 });
      }
    });
  }
});

Template.home.onCreated(function() {
  if (!Meteor.userId()) FlowRouter.go('/');
  this.subscribe('userNotifications');
});

Template.home.helpers({
  notifications() {
    return Notification.find({ is_read: false }).count();
  }
});


Template.signup.events({
  'submit [name="signupForm"]'(e, tpl) {
    e.preventDefault();
    let formEl = $('[name="signupForm"]'),
        userFields = formEl.serializeObject();
    Accounts.createUser({
      email: userFields.email,
      password: userFields.password,
      username: userFields.fullname,
      porfile: { location: '' }
    }, function(err) {
      if (err) return console.log(err);
      FlowRouter.go('/home');
    });
  }
  
});