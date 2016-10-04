const lock = new Auth0Lock(env.AUTH0_CLIENT_ID, env.AUTH0_DOMAIN);

lock.on('authenticated', function (authResult) {
  // Send a message now to your messaging api.
  localStorage.setItem('idToken', authResult.idToken);
  // Alternatively do something else.
  window.close();
});
