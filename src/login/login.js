const lockOpts = JSON.parse(window.location.hash ? window.location.hash.substr(1) : '{}');
const lock = new Auth0Lock(env.AUTH0_CLIENT_ID, env.AUTH0_DOMAIN, lockOpts);
lock.show();
