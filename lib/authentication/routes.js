// app/routes.js

var email = require('../messaging/email');
var sms = require('../messaging/sms');

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.send('Babies are cute, aren\'t they?');
	});

	app.get('/danger', function (req, res) {
		email.send({
			to:       'karanmatic@gmail.com',
			from:     'other@example.com',
			subject:  'Baby Warning',
			text:     'Baby is sleeping on chest. Get to him now.'
		}, function () {
			res.send('done');
		});
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
	};
}

