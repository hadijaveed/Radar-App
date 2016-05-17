FlowRouter.route('/', {
  name: 'userLogin',
  template: 'login',
  action() {
    BlazeLayout.render('login');
  }
});

FlowRouter.route('/signup', {
  name: 'userSignup',
  template: 'signup',
  action() {
    BlazeLayout.render('signup');
  }
});

FlowRouter.route('/home', {
  name: 'homePage',
  template: 'home',
  action() {
    BlazeLayout.render('home');
  }
});

FlowRouter.route('/add_event', {
  name: 'add_event',
  template: 'add_event',
  action() {
    BlazeLayout.render('home', { template: 'add_event' });
  }
});

FlowRouter.route('/follow_events', {
  name: 'follow_events',
  template: 'follow_events',
  action() {
    BlazeLayout.render('home', { template: 'follow_events' });
  }
});