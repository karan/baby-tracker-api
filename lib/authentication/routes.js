// app/routes.js

var email = require('../messaging/email');
var sms = require('../messaging/sms');
var request = require('request');
var async = require('async');

module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.send('Babies are cute, aren\'t they?');
  });

  app.get('/danger/:value', function (req, res) {
    var value = +req.params.value;

    // email
    if (value === 1) {
      email.send({
        to:       'karanmatic@gmail.com',
        from:     'other@example.com',
        subject:  'Baby Warning',
        text:     'Baby is sleeping on chest. Get to him now.'
      }, function () { });
    } else {
      email.send({
        to:       'karanmatic@gmail.com',
        from:     'other@example.com',
        subject:  'Baby Warning Ended',
        text:     'Baby is fine now. You are a good parent!'
      }, function () { });
    }

    // SMS
    sms.send({
      body: "Baby is sleeping on chest. Get to him now.",
      to: process.env.PHONE,
      from: "+16506469710"
    }, function () { });

    // smartthings
    var url = 'https://graph.api.smartthings.com/api/smartapps/installations/40f0fc12-7ea9-4b62-86e7-30588c71df64/babyincradle';
    request({
      url: url,
      method: 'PUT',
      headers: { "Authorization": "Bearer 8b35f1bd-d58d-41a2-89b1-4c4608fa4e54" },
      body: { 'isPressure': value },
      json: true,
      timeout: 500
    }, function(err, resp, body) {
      if (err) {
        console.log(err);
      } else {
        console.log(resp.statusCode);
      }
    });

    res.send(200);
  });

  // =====================================
  // JAWBONE ROUTES =====================
  // =====================================
  // route for jawbone authentication and login
  app.get('/auth/jawbone', passport.authenticate('jawbone', { scope : ['basic_read','extended_read','friends_read','move_read','sleep_read','meal_read','mood_write'] }));

  // handle the callback after jawbone has authenticated the user
  app.get('/auth/jawbone/callback',
    passport.authenticate('jawbone', {
      failureRedirect : '/auth/jawbone'
    }));

  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the auth page
    res.redirect('/auth/jawbone');
  }
};