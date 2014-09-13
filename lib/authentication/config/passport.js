/// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var JawboneStrategy = require('passport-oauth').OAuth2Strategy;

// load up the user model
var User       		= require('../models/user');

// up profile
global.up_me = {
                data : { xid:'12345'}
            };
            
// load the auth variables
var configAuth = require('./auth');


// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // JAWBONE ================================================================
    // =========================================================================
    passport.use('jawbone', new JawboneStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.jawboneAuth.clientID,
        clientSecret    : configAuth.jawboneAuth.clientSecret,
        callbackURL     : configAuth.jawboneAuth.callbackURL,
        authorizationURL: configAuth.jawboneAuth.authorizationURL,
        tokenURL        : configAuth.jawboneAuth.tokenURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
            

    // jawbone will send back the token and profile
    function(req, token, refreshToken, profile, done) {


        // asynchronous
        process.nextTick(function() {


        // set up jawbone api access        
        var options = {
      		'client_id' : configAuth.jawboneAuth.clientID,
      		'client_secret' : configAuth.jawboneAuth.clientSecret,
      		'access_token' : token}
        up = require('jawbone-up')(options);
        
        // get jawbone profile info
        up.me.get({}, function(err, body) {
          console.log('Body: ' + body);
          up_me = JSON.parse(body);
          global.userName = up_me.data.first + ' ' + up_me.data.last;
    

        	// check if the user is already logged in
        	if (!req.user) {
	            // find the user in the database based on their jawbone id
	            

	            User.findOne({ 'jawbone.id' : up_me.data.xid }, function(err, user) {

	                // if there is an error, stop everything and return that
	                // ie an error connecting to the database
	                if (err)
	                    return done(err);

	                // if the user is found, then log them in
	                if (user) {

	                	// if there is a user id already but no token (user was linked at one point and then removed)
	                	// just add our token and profile information
	                    if (!user.jawbone.token) {
	                        user.jawbone.token = token;
	                        user.jawbone.name  = up_me.data.first + ' ' + up_me.data.last;
							
            							user.save(function (err, user) {
            							  if (err) return console.error(err);
            							  return done(null, user);
            							});
	                    }

	                    return done(null, user); // user found, return that user
	                } else {
	                    
	                    // if there is no user found with that jawbone id, create them
	                    var newUser            = new User();

	                    // set all of the jawbone information in our user model
	                    newUser.jawbone.id    = up_me.data.xid; // set the users jawbone id                   
	                    newUser.jawbone.token = token; // we will save the token that jawbone provides to the user                    
	                    newUser.jawbone.name  = up_me.data.first + ' ' + up_me.data.last; // look at the passport user profile to see how names are returned

	                    // save our user to the database
          						newUser.save(function (err, user) {
          						  if (err) return console.error(err);
          						  return done(null, newUser);
          						});

                      // if successful, return the new user
                      return done(null, newUser);
	                }

	            });

	        } else {
      				// user already exists and is logged in, we have to link accounts
	            var user            = req.user; // pull the user out of the session

      				// update the current users jawbone credentials
	            user.jawbone.id    = up_me.data.xid;
	            user.jawbone.token = token;
	            user.jawbone.name  = up_me.data.first + ' ' + up_me.data.last;

      				// save the user
      				user.save(function (err, user) {
      				  if (err) return console.error(err);
      				  return done(null, user, console.log('Welcome '+up_me.data.first+', from UP!'));
      				});;
	        }
            });
        });

    }));
    
   
};

