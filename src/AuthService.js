import Auth0Lock from 'auth0-lock';
import { Auth0ChromeBackgroundHelper } from './Auth0ChromeBackgroundHelper';
import jwtDecode from 'jwt-decode';

export class AuthService {

  constructor(domain, clientId, options) {
    this.lock = new Auth0Lock(clientId, domain, options);
    this.auth0 = new Auth0ChromeBackgroundHelper(clientId, domain);
  }

  on(event, cb) {
    return this.auth0.on(event, cb);
  }

  getIdToken() {
    return window.localStorage.getItem('id_token');
  }

  setIdToken(token) {
    window.localStorage.setItem('id_token', token);
  }

  show() {
    this.lock.show();
  }

  getProfile() {
    const idToken = this.getIdToken();
    this.lock.getProfile(idToken, function (err, profile) {
      if(err) {
        cb(err);
      }
      cb(null, profile);
    });
  }

  isAuthenticated() {
    const idToken = this.getIdToken();
    if (!idToken) {
      return false;
    }

    const payload = jwtDecode(idToken);

    return (payload.exp > (Date.now() / 1000));
  }

  logout() {
    window.localStorage.removeItem('id_token');
  }

  isChromeExtension() {
    return !!(window.chrome && chrome.runtime && chrome.runtime.id);
  }

}
