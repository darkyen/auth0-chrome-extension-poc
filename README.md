# auth0-chrome-extension-poc
This repository contains code that can be used as a base to initialize Auth0 in context of a Chrome Extension. The process looks like the following.

<img width="1378" alt="screen shot 2016-10-05 at 1 48 19 am" src="https://cloud.githubusercontent.com/assets/1041315/19102676/1b570854-8aa0-11e6-96ac-5207e4376748.png">
---
<img width="1380" alt="screen shot 2016-10-05 at 1 55 44 am" src="https://cloud.githubusercontent.com/assets/1041315/19102656/f16429a0-8a9f-11e6-8c8c-3fefa0b37d95.png">
---
<img width="1378" alt="screen shot 2016-10-05 at 1 56 19 am" src="https://cloud.githubusercontent.com/assets/1041315/19102650/e6296d20-8a9f-11e6-8809-778443681aac.png">


# What is happening here
From `browser_action/browser_action.html` we open a new popup that contains Lock in redirect mode at `login/login.html`, the `login.html` code will intialize a new Lock based on parameters passed by `browser_action` allowing the same page to be used with multiple locks. The `redirect_uri` is set to `callback/callback.html` where we set the `idToken` if you have background events or background pages in your application you can optionally send a message to your extension with the callback and initiate a visual feedback, here we simply send a notification.

# Required Permissions
- In chrome manifest you need to allow access to `src/callback/callback.html`

  ```json
    "web_accessible_resources": [
      "src/callback/*"
    ]
  ```
- You will need to allow access to your Auth0 domain and Auth0 CDN

  ```json
    "permissions": [
      "https://chrome-extension-sample.auth0.com/*",
      "https://cdn.auth0.com/*"
    ]
  ```
