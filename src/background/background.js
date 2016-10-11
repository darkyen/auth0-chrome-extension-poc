
function EventEmitter(){
  this._events = {};
}

EventEmitter.prototype = {
    on: function (ev, handler) {
        var events = this._events

        ;(events[ev] || (events[ev] = [])).push(handler)
    },
    removeListener: function (ev, handler) {
        var array = this._events[ev]

        array && array.splice(array.indexOf(handler), 1)
    },
    emit: function (ev) {
        var args = [].slice.call(arguments, 1),
            array = this._events[ev] || []

        for (var i = 0, len = array.length; i < len; i++) {
            array[i].apply(this, args)
        }
    },
    once: function (ev, handler) {
        this.on(ev, remover)

        function remover() {
            handler.apply(this, arguments)
            this.removeListener(ev, remover)
        }
    }
}


module.exports.constructor.prototype = module.exports
function Auth0ChromeBackgroundHelper (clientID, domain) {
  const ee = this;
  EventEmitter.call(this);
  // DON'T Emitter.prototype = new require('events').EventEmitter();

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


    ee.emit(eName, result);

    return response;
  }, {
    // Only intercept requests from this client.
    urls: [redirectUrl + '*']
  }, ['blocking']);
}

Auth0ChromeBackgroundHelper.prototype =
