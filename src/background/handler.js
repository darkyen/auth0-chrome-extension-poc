const auth0 = new Auth0ChromeBackgroundHelper(env.AUTH0_CLIENT_ID, env.AUTH0_DOMAIN);

auth0.on("authenticated", function (response){
  localStorage.idToken = response.idToken;
  chrome.notifications.create("42", {
    type: "basic",
    title: "Login Complete",
    iconUrl: "icons/icon128.png",
    message: "You have successfully logged in using Auth0",
  });
});

auth0.on('authorization_error', function (response) {
  chrome.notifications.create("43", {
    type: "basic",
    title: response.error,
    iconUrl: "icons/icon128.png",
    message: response.error_description,
    isClickable: true
  });
});
