chrome.runtime.onMessage.addListener(function (event) {
  if (event.type === 'authenticate') {
    new Auth0Chrome.default('chrome-extension-sample.auth0.com', 'C53AVN40rXTKD8IUQzWybTkBBGJcLQrM')
      .authenticate()
      .then(function (authResult) {
        localStorage.authResult = JSON.stringify(authResult);
      });
  }
});
