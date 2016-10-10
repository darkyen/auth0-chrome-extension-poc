
function Auth0ChromeBackgroundHelper (clientID, domain) {

  const a0 = new Auth0({
    clientID: clientID,
    domain: domain
  });

  // This url is going to be constant.
  const redirectUrl = chrome.identity.getRedirectURL('auth0/callback');
  const wsFedUrl = 'https://' + domain + '/login/callback';

  // Required for our form-post callback handling only in case of when coming from lock
  chrome.webRequest.onHeadersReceived.addListener(function filterWSFedCallback (details) {

    console.log('onHeadersReceived', details);

    const tabId = details.tabId;

    if ( details.method !== 'POST' ) {
      return;
    }

    if( tabId !== chrome.tabs.TAB_ID_NONE ){
      return;
    }

    if( details.statusCode !== 302 ){
      // Some error have occured
      return;
    }

    const locationHeader = details.responseHeaders.filter(header => header.name === 'location')[0];

    if( !locationHeader ) {
      return;
    }

    const newTabUrl = 'https://' + domain + locationHeader.value;
    chrome.tabs.create({
      url: newTabUrl,
      active: true
    });

    return {
      redirectUrl: 'data:text/html,<script>window.close()</script>'
    };

  },{
    urls: [wsFedUrl]
  }, ["blocking", "responseHeaders"]);


  chrome.webRequest.onBeforeRequest.addListener(function filterAuth0Callback (details) {
    console.log('onBeforeRequest', details);

    const tabId = details.tabId;
    const response = {};

    chrome.tabs.remove(details.tabId);
    response.cancel = true;

    const hash = '#' + details.url.split('#')[1];
    const result = a0.parseHash(hash);

    // Send message to make the extension aware of login completion
    // Create the event
    const eName = result.error? 'authorization_error': 'authenticated';
    const ev = new CustomEvent(eName, {
      detail: result
    });

    // Dispatch/Trigger/Fire the event
    document.dispatchEvent(ev);

    return response;
  }, {
    // Only intercept requests from this client.
    urls: [redirectUrl + '*']
  }, ['blocking']);
}
