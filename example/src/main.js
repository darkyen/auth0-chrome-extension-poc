chrome.runtime.onMessage.addListener(function (event) {
  if (event.type === 'authenticate') {
    new Auth0Chrome(env.AUTH0_DOMAIN, env.AUTH0_CLIENT_ID)
      .authenticate()
      .then(function (authResult) {
        localStorage.authResult = JSON.stringify(authResult);
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Login Successful',
          message: 'You can use the app now'
        });
      }).catch(function (err) {
        chrome.notifications.create({
          type: 'basic',
          title: 'Login Failed',
          message: err.message,
          iconUrl: 'icons/icon128.png'
        });
      });
  }
});
