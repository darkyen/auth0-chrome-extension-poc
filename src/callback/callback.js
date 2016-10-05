const lock = new Auth0Lock(env.AUTH0_CLIENT_ID, env.AUTH0_DOMAIN);

lock.on('authenticated', function (authResult) {
  localStorage.setItem('idToken', authResult.idToken);
  window.close();
});
