/* ================= REQUIRE MODULES ===================== */

var express      = require('express');
var app          = express();
var mongoose     = require('mongoose');
var uriUtil      = require('mongodb-uri');
var path         = require('path');
var fs           = require('fs');
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var passport     = require('passport');
var session      = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt        = require('bcrypt-nodejs');

/* ===================== CONFIGURATION ==================== */

var port = process.env.PORT || 9001;					                    // Default port or port 9001

/*
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 */

var options = {
	server: {
		socketOptions: {
			keepAlive: 1,
			connectTimeoutMS: 30000
		}
	},
	replset: {
		socketOptions: {
			keepAlive: 1,
			connectTimeoutMS : 30000
		}
	}
};

/*
 * Mongoose uses a different connection string format than MongoDB's standard.
 * Use the mongodb-uri library to help you convert from the standard format to
 * Mongoose's format.
 */

var mongodbUri = 'mongodb://geekwiseuser:geekwise@ds045679.mongolab.com:45679/geekwise';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var conn = mongoose.connection;

mongoose.connect(mongooseUri, options);
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
	// Wait for the database connection to establish, then start the app.
});

/* ======================== MODELS ======================== */
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
	if(~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

/* ===================== PASSPORT ========================= */
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var User = mongoose.model('User');

    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
    var User = mongoose.model('User');

    User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);

        function cb(err, isMatch) {
            if (err) return done(err);
            if (isMatch) return done(null, user);
            return done(null, false);
        }
        bcrypt.compare(password, user.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    });
}));

/* ================= REGISTER MODULES ===================== */
app.use(favicon());
app.use(logger('dev'));                                 		        // log every request to the console
app.use(bodyParser.json());                             		        // have the ability to simulate DELETE and PUT
app.use(bodyParser.urlencoded());                       		        // have the ability to simulate DELETE and PUT
app.use(cookieParser());                                		        // have the ability to parse cookies
app.use(session({ secret: 'blackwidow straw' }));                       // Encryption key/salt
app.use(passport.initialize());                                         // Initializes passport
app.use(passport.session());                                            // Creates a passport session
app.use(express.static(path.join(__dirname, 'public')));		        // set the static files location
app.use(function(req, res, next) {
    if (req.user) {
        res.cookie('user', JSON.stringify(req.user));
    }
    next();
});

/* ======================== ROUTES ========================= */
require('./routes.js')(app);                            		        // configure our routes, passing in app reference

/* =============== START APP (THIS GOES LAST) ============== */
app.listen(port);                                                       // startup our app at http://localhost:9001
console.log('The MEAN app is served up at http://localhost:' + port);   // shoutout to the user
exports = module.exports = app;                                         // expose app
