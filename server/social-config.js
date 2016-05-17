ServiceConfiguration.configurations.remove({
  service: 'facebook'
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: '224749737916650',
  loginStyle: 'popup',
  secret: '26f24e93eb6978e83f0eca4df574c936'
});

FBGraph.setVersion('2.6');
