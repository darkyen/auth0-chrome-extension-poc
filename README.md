# auth0-chrome-extension-poc
This repository contains code that can be used as a base to initialize Auth0 in context of a Chrome Extension. The process looks like the following (Screenshots incoming)


# What is happening here
We override Auth0JS.login in the same fashion as our cordova handler does in order to create a chrome tab when using a social provider, in case of username password we intercept the request that posts the wsFed form and extract the location header, we close the original window (which is browser_action) and open the intended redirect-to window in a chrome tab as chrome shares cookies this works just fine and MFA works.

# Required Permissions

- You will need to allow access to your Auth0 domain and Auth0 CDN

  ```json
    "permissions": [
      "https://chrome-extension-sample.auth0.com/*",
      "webRequest",
      "webRequestBlocking",
      "identity",
      "https://{EXTENSION_ID}.chromiumapp.org/auth0/callback*"

    ]
  ```
  Explanation of permissions
  - webRequest : Allows Intecepting WebRequest used to create the virtual callback endpoint.
  - webRequestBlocking : Allows control over cancelling requests / closing windows just in time. [WIP: I might be able to make do without this]
  - identity: Googles way of creating and returning identity urls https://{EXTENSION_ID}.chromiumapp.org/ (Optionally we can drop this in favor of a simple polyfill for this)
  - Access to "https://{EXTENSION_ID}.chromiumapp.org/auth0/callback*", allows intercepting the callback and authenticating.

- In content security policy, you'll need to allow, this is because Lock loads the client file from the CDN
  ```json
    "content_security_policy": "script-src 'self' https://cdn.auth0.com blob: filesystem: chrome-extension-resource:"
  ```
