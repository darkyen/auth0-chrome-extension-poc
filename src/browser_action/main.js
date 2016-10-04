const authService = new AuthService(env.AUTH0_DOMAIN, env.AUTH0_CLIENT_ID, env.CHROME_APP_ID);

function renderProfileView(){
  authService.getProfile(function(err, profile){
    if(!err){
      document.body.innerHTML = JSON.stringify(profile);
    }else{
      document.body.innerHTML = 'There was an error fetching profile, ' + err.message;
    }
  });
}

if(authService.isLoggedIn()){
  renderProfileView();
}else{
  setTimeout(function(){
    authService.show();
  }, 400);
}
