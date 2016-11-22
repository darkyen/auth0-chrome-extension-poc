// Es6 Override
if(!window.Auth0){
  throw new Error('Auth0.just must be loaded, you can either do this by loading auth0-js or by loading Lock from the CDN/Bower package');
}

/*
  @TODO: Enforce PKCE, this should not be using implicit flow.
*/
window.Auth0 = class extends window.Auth0{
  // This is a passthrough, in most cases, so you can safely share code between packages
  login(options, callback) {
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

    if (isChromeExtension()) {
      return this.loginChromeExtension(options);
    }

    if (!!options.popup && this._getCallbackOnLocationHash(options)) {
      return this.loginWithPopup(options, callback);
    }

    this._authorize(options);
  }

  loginChromeExtension(options) {
    const qs = [
      this._getMode(options),
      options,
      {
        client_id: this._clientID,
        redirect_uri: this._getCallbackURL()
      }
    ];

    if ( this._sendClientInfo ) {
      qs.push({
        auth0Client: this._getClientInfoString()
      });
    }

    const query = this._buildAuthorizeQueryString(qs);
    const authorizeUrl = 'https://' + this._domain + '/authorize?' + query;

    // @Todo: Maybe handle this in chrome.
    chrome.tabs.create({
      url: authorizeUrl,
      active: true
    });
  }


  _getCallbackURL(options) {
    if(isChromeExtension()) {
      return chrome.identity.getRedirectURL('auth0/callback');
    }

    return (options && typeof options.callbackURL !== 'undefined') ?
        options.callbackURL : this._callbackURL;
  }
}

export default window.Auth0;
