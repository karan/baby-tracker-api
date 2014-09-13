// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'jawboneAuth' : {
	       'clientID' 	  : 'NDWjbOplTJY', // your App ID
	       'clientSecret' 	  : 'd74cfa3ac728c7c482f9568bd305b581df817791',
	       'authorizationURL' : 'https://jawbone.com/auth/oauth2/auth',
	       'tokenURL'         : 'https://jawbone.com/auth/oauth2/token',
	       'callbackURL' 	  : 'http://sleepybaby.herokuapp.com/auth/jawbone/callback'
	}

};

