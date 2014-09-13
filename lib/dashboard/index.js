var express = require('express');
var app = module.exports = express();
var util = require("util");

// load the auth variables
var configAuth = require('../authentication/config/auth');


function getDate(seconds) {
	var date = new Date(0);
	date.setUTCSeconds(seconds);
	return date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
}

app.get('/sleeps', isLoggedIn, function(req, res) {

  // set up jawbone api access        
  var options = {
		'client_id' : configAuth.jawboneAuth.clientID,
		'client_secret' : configAuth.jawboneAuth.clientSecret,
		'access_token' : req.user.jawbone.token 
	};
  up = require('jawbone-up')(options);
	
  // get last nights sleep quality 
	function getSleep() {
    up.sleeps.get({}, function(err, body) {
    	all_sleeps = [];
      sleep_me = JSON.parse(body);
      sleep_me = sleep_me.data.items.slice(0, 5);
		  for (var i = 0; i < sleep_me.length; i++) {
		  	this_sleep = sleep_me[i];
		  	date = getDate(this_sleep.time_created);
		  	total_time = this_sleep.title.slice(4, this_sleep.title.length);
		  	total_time_secs = this_sleep.details.duration;
		  	console.log(this_sleep.details);
		  	awake = Math.round(this_sleep.details.awake * 100 / total_time_secs);
		  	deep = Math.round(this_sleep.details.deep * 100 / total_time_secs);
		  	all_sleeps.push({
		  		date: date, total_time: total_time, awake: awake, deep: deep
		  	});
		  }

		  res.send(all_sleeps);
		});
	};
	
	getSleep();
	
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the auth page
	res.redirect('/auth');
};
