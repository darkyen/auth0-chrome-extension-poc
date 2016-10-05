const authService = new AuthService(env.AUTH0_DOMAIN, env.AUTH0_CLIENT_ID, env.CHROME_APP_ID);

// Minimal jQuery
const $$ = document.querySelectorAll.bind(document);
const $  = document.querySelector.bind(document);


function renderProfileView(){
  $('.default').classList.add('hidden');
  $('.loading').classList.remove('hidden');

  $('.logout-button').addEventListener('click', function(){
    authService.logout();
    main();
  });

  authService.getProfile(function (err, profile) {
    if(err){
      document.body.innerHTML = 'There was an error fetching profile, ' + err.message;
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

  $('.login-button').addEventListener('click', function(){
    $('.default').classList.add('hidden');
    $('.loading').classList.remove('hidden');
    authService.show({
      theme: {
        logo: 'https://cdn.auth0.com/styleguide/1.0.0/img/badge.png'
      }
    });
  });
}

function main () {
  if(authService.isLoggedIn()){
    renderProfileView();
  }else{
    renderDefaultView();
  }
}


document.addEventListener('DOMContentLoaded', main);
