import Auth0 from 'auth0-js';

function checkIfSet(obj, key) {
  /*
   * false      != null -> true
   * true       != null -> true
   * undefined  != null -> false
   * null       != null -> false
   */
  return !!(obj && obj[key] != null);
}

export class Auth0Chrome {

  constructor(clientId, domain) {
    this.auth0 = new Auth0({ clientID: clientId, domain });
  }

  login(options, callback) {
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

    if (isChromeExtension()) {
      return this.loginChromeExtension(options);
    }

    if (!!options.popup && this._getCallbackOnLocationHash(options)) {
      return this.loginWithPopup(options, callback);
    }

    this.auth0._authorize(options);
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

    if ( this.auth0._sendClientInfo ) {
      qs.push({ auth0Client: this.auth0._getClientInfoString() });
    }

    const query = this._buildAuthorizeQueryString(qs);
    const authorizeUrl = 'https://' + this._domain + '/authorize?' + query;

    // @Todo: Maybe handle this in chrome.
    chrome.tabs.create({
      url: authorizeUrl,
      active: true
    });
  }
  
  parseHash(hash) {
    return this.auth0.parseHash(hash);
  }

  _getCallbackURL(options) {
    if(isChromeExtension()) {
      return chrome.identity.getRedirectURL('auth0/callback');
    }

    return (options && typeof options.callbackURL !== 'undefined') ?
        options.callbackURL : this.auth0._callbackURL;
  }
}