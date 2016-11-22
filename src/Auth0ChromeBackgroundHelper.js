import Auth0Chrome from './Auth0Chrome';
import { EventEmitterLight } from './EventEmitterLight';

/* @TODO: Enforce PKCE, this should not be using implicit flow. */
export default class Auth0ChromeBackgroundHelper extends EventEmitterLight {
  constructor (clientId, domain) {
    super();
    this.auth0 = new Auth0Chrome(clientId, domain);

    const redirectUrl = chrome.identity.getRedirectURL('auth0/callback');
    const wsFedUrl = `https://${domain}/login/callback`;

    // Required for our form-post callback handling only in case of when coming from lock
    try{
      chrome.webRequest.onHeadersReceived.addListener(this.handleWSFedCallback.bind(this), {
        urls: [wsFedUrl]
      }, ["blocking", "responseHeaders"]);


      // Only intercept requests from this client.
      chrome.webRequest.onBeforeRequest.addListener(this.handleRedirectAndCloseTab.bind(this), {
        urls: [this.redirectUrl + '*']
      }, ['blocking']);
    }catch(e){
      console.warn('You should not, initialize Auth0ChromeBackgroundHelper in foreground, this code belongs to background.js');
    }

  }

  handleWSFedCallback (details) {
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
  }

  handleRedirectAndCloseTab (details) {
    const tabId = details.tabId;
    const response = {};

    chrome.tabs.remove(tabId);
    response.cancel = true;

    const hash = '#' + details.url.split('#')[1];
    const result = this.auth0.parseHash(hash);

    // Send message to make the extension aware of login completion
    // Create the event
    const eName = result.error? 'authorization_error': 'authenticated';

    this.emit(eName, result);

    return response;
  }
}
