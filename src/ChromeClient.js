import PKCEClient from './PKCEClient';
import autobind from 'core-decorators/lib/autobind';

@autobind
class ChromeClient extends PKCEClient {
  getAuthResult (url, interactive) {
    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow({url, interactive}, (callbackURL) => {
        if ( chrome.runtime.lastError ) {
          return reject(new Error(chrome.runtime.lastError.message))
        }
        resolve(callbackURL);
      });
    });
  }

  getRedirectURL () {
    return chrome.identity.getRedirectURL('auth0');
  }
}

export default ChromeClient;
