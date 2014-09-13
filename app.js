// installed modules ==================================
var express 	= require('express');
var app 		= express();
var MongoStore 	= require('connect-mongo')(express);
var port    	= process.env.PORT || 3000;
var mongoose 	= require('mongoose');
var passport 	= require('passport');
var configDB 	= require('./lib/authentication/config/database.js');

mongoose.connect(configDB.url); // connect to our database
mongoose.set('debug', true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('db connection open ');
});



require('./lib/authentication/config/passport')(passport); // pass passport for configuration

// application developed modules ==================================
var nodepath 	= process.env.NODE_PATH || 'lib';
var dashboard 	= require('./lib/dashboard');


// configuration  =================================================
app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	// required for passport
	app.use(express.session({
		store: new MongoStore({
			url: configDB.url
		}),
		secret: 'ilovesuppywuppyup' 
	})); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
});


// routes  ========================================================
require('./lib/authentication/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use(dashboard);



app.listen(port);
console.log('UP is alive on port ' + port);


