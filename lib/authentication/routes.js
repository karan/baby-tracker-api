// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.send('Babies are cute, aren\'t they?');
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
		res.redirect('/auth');
	};
}

