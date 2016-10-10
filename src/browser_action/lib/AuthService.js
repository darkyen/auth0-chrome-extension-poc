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


function checkIfSet(obj, key) {
  /*
   * false      != null -> true
   * true       != null -> true
   * undefined  != null -> false
   * null       != null -> false
   */
  return !!(obj && obj[key] != null);
}


function isChromeExtension(){
  return !!(window.chrome && chrome.runtime && chrome.runtime.id)
}


AuthService.prototype.show = function (lockOptions) {
  const lock = new Auth0Lock(this.clientId, this.domain, lockOptions);
  lock.show();
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
