function AuthService (domain, clientId) {
  this.domain   = domain;
  this.clientId = clientId;
}

AuthService.prototype.getIdToken = function () {
  return localStorage.getItem('idToken');
}

AuthService.prototype.setIdToken = function (idToken) {
  localStorage.setItem('idToken', idToken)
}

AuthService.prototype.isLoggedIn = function () {
  const idToken = this.getIdToken();
  if(!idToken){
    return false;
  }
  const payload = jwt_decode(idToken);

  return (payload.exp > (Date.now() / 1000));
}

AuthService.prototype.show = function (lockOptions) {
  const runtime = chrome.runtime;

  lockOptions = lockOptions || {};
  lockOptions.auth = lockOptions.auth || {};
  lockOptions.auth.redirectUrl = runtime.getURL('src/callback/callback.html');
  lockOptions.auth.responseType = 'token';
  lockOptions.auth.scope = 'openid';
  lockOptions.closable = false;


  var options = {
    // Create url to login page, and pass it our lock options, optional
    'url': runtime.getURL('src/login/login.html') + '#' + JSON.stringify(lockOptions),
    'focused': true,
    'type': 'popup',
    'width': 320,
    'height': 640
  };

  // At this point the extension will lose control
  chrome.windows.create(options);
}


AuthService.prototype.getProfile = function (cb) {
  const lock = new Auth0Lock(this.clientId, this.domain);
  const idToken = this.getIdToken();
  lock.getProfile(idToken, function (err, profile) {
    if(err){
      cb(err);
    }
    cb(null, profile);
  });
}

AuthService.prototype.logout = function(){
  localStorage.removeItem('idToken');
}
