// This file overrides Auth0 global instance to inject the chrome specific code
Auth0.prototype.login = Auth0.prototype.signin = function (options, callback) {
  // TODO Change this to a property named 'disableSSO' for consistency.
  // By default, options.sso is true
  if (!checkIfSet(options, 'sso')) {
    options.sso = true;
  }

  if (typeof options.passcode !== 'undefined') {
    return this.loginWithPasscode(options, callback);
  }

  if (typeof options.username !== 'undefined' ||
      typeof options.email !== 'undefined') {
    return this.loginWithUsernamePassword(options, callback);
  }

  if (!!window.cordova || !!window.electron) {
    return this.loginPhonegap(options, callback);
  }

  if(isChromeExtension()){
    return this.loginChromeExtension(options);
  }

  if (!!options.popup && this._getCallbackOnLocationHash(options)) {
    return this.loginWithPopup(options, callback);
  }

  this._authorize(options);
};

// Effectively Redirect mode
Auth0.prototype.loginChromeExtension = function (options) {
  const _this = this;
  const qs = [
    this._getMode(options),
    options,
    {
      client_id: this._clientID,
      redirect_uri: this._getCallbackURL()
    }
  ];

  if ( this._sendClientInfo ) {
    qs.push({ auth0Client: this._getClientInfoString() });
  }

  const query = this._buildAuthorizeQueryString(qs);
  const authorizeUrl = 'https://' + this._domain + '/authorize?' + query;

  // @Todo: Maybe handle this in chrome.
  chrome.tabs.create({
    url: authorizeUrl,
    active: true
  });
}

Auth0.prototype._getCallbackURL = function(options) {
  if(isChromeExtension()){
    return chrome.identity.getRedirectURL('auth0/callback');
  }

  return (options && typeof options.callbackURL !== 'undefined') ?
      options.callbackURL : this._callbackURL;
}
