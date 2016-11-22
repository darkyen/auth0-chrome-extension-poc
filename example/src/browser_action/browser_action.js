import decodeJwt from 'decode-jwt';
const lock = new Auth0Lock(env.AUTH0_DOMAIN, env.AUTH0_CLIENT_ID, {
  theme: {
    logo: 'https://cdn1.tnwcdn.com/wp-content/blogs.dir/1/files/2014/08/canary-logo.png',
    primaryColor: '#FFC400'
  },
  auth: {
    responseType: 'token',
    scope: 'openid',
  },
  languageDictionary: {
    title: 'Chrome Sample',
  },
  container: 'mainPopup'
});

function isLoggedIn (token) {
  return decodeJwt(token).exp > Date.now() / 1000;
}

function logout(){
  // Remove the idToken from storage
  return localStorage.clear();
}

// Minimal jQuery
const $$ = document.querySelectorAll.bind(document);
const $  = document.querySelector.bind(document);


function renderProfileView(){
  $('.default').classList.add('hidden');
  $('.loading').classList.remove('hidden');

  $('.logout-button').addEventListener('click', function(){
    logout();
    main();
  });

  /* @TODO: Replace this with getUserData */
  lock.getProfile(function (err, profile) {
    if(err){
      document.body.innerHTML = 'There was an error fetching profile, ' + err.message + ' please reload the extension.';
      return;
    }

    ['picture', 'name', 'nickname'].forEach(function (key) {

      const element = $('.' +  key);
      if( element.nodeName === 'DIV' ) {
        element.style.backgroundImage = 'url(' + profile[key] + ')';
        return;
      }

      element.textContent = profile[key];
    });

    $('.loading').classList.add('hidden');
    $('.profile').classList.remove('hidden');
  });
}


function renderDefaultView(){
  $('.default').classList.remove('hidden');
  $('.profile').classList.add('hidden');
  $('.loading').classList.add('hidden');

  $('.login-button').addEventListener('click', () => {
    $('.default').classList.add('hidden');
    $('.loading').classList.remove('hidden');
    lock.show();
  });
}

function main () {
  const token = localStorage.idToken;
  if(isLoggedIn(token)){
    renderProfileView(token);
  }else{
    renderDefaultView();
  }
}


document.addEventListener('DOMContentLoaded', main);
