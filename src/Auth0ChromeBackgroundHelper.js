import { Auth0Chrome } from './Auth0Chrome';
import { EventEmitterLight } from './EventEmitterLight';

export class Auth0ChromeBackgroundHelper extends EventEmitterLight {

  auth0;
  ee = new EventEmitterLight();
  redirectUrl = chrome.identity.getRedirectURL('auth0/callback');
  wsFedUrl;

  constructor(clientId, domain) {
    super();

    this.auth0 = new Auth0Chrome(clientId, domain);

    this.wsFedUrl = `https://${domain}/login/callback`;

    // Required for our form-post callback handling only in case of when coming from lock
    chrome.webRequest.onHeadersReceived.addListener(details => {

      const tabId = details.tabId;

      if (details.method !== 'POST') {
        return;
      }

      if (tabId !== chrome.tabs.TAB_ID_NONE) {
        return;
      }

      if (details.statusCode !== 302) {
        // Some error have occured
        return;
      }

      const locationHeader = details.responseHeaders.filter(header => header.name === 'location')[0];

      if (!locationHeader) {
        return;
      }

      const newTabUrl = locationHeader.value;

      chrome.tabs.create({
        url: newTabUrl,
        active: true
      });

      return {
        redirectUrl: 'data:text/html,<script>window.close()</script>'
      }

    }, {
      urls: [this.wsFedUrl]
    }, ["blocking", "responseHeaders"]);


    chrome.webRequest.onBeforeRequest.addListener(details => {
      const tabId = details.tabId;
      const response = {};

      chrome.tabs.remove(tabId);
      response.cancel = true;

      const hash = '#' + details.url.split('#')[1];
      const result = this.auth0.parseHash(hash);

      // Send message to make the extension aware of login completion
      // Create the event
      const eName = result.error? 'authorization_error': 'authenticated';

      this.ee.emit(eName, result);

      return response;
      
    }, {
      // Only intercept requests from this client.
      urls: [this.redirectUrl + '*']
    }, ['blocking']);
  
  }
}