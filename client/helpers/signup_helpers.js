Template.login.onCreated(function() {
  if (Meteor.userId()) FlowRouter.go('/home');
});

Template.login.events({
  'click [name="loginWithFacebook"]'(e, tpl) {
    Meteor.loginWithFacebook({}, (err) => {
      if (err) {
        throw new Meteor.Error('Login Failed');
      } else {
        FlowRouter.go('/home');
      }
    });
  }
});

Template.home.onCreated(function() {
  if (!Meteor.userId()) FlowRouter.go('/');
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