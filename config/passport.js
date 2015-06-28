
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('./auth');

var User = require('../BE/models/user');

module.exports = function(passport) {

  // API Access link for creating client ID and secret:
  // https://code.google.com/apis/console/
  var GOOGLE_CLIENT_ID = configAuth.googleAuth.clientID;
  var GOOGLE_CLIENT_SECRET = configAuth.googleAuth.clientSecret;
  var GOOGLE_CALLBACK_URL = configAuth.googleAuth.callbackURL;

  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  However, since this example does not
  //   have a database of user records, the complete Google profile is
  //   serialized and deserialized.
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  // Use the GoogleStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and Google
  //   profile), and invoke a callback with a user object.
  passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        //FIXME: req.user is always undefined!
        if (!req.user) {
          //USER IS NOT LOGGED IN
          User.findOne({'google.id' : profile.id}, function(err, user) {
            if (err) return done(err);
            if (user) {
              //LOGIN
              user.provider = 'google';
              user.google.token = accessToken;
              user.loginCount ++;
              user.save(function(err) {
                if (err) throw err;
                return done(null, user);
              });
            } else {
              //SIGNUP
              if (profile.emails && profile.emails[0] && profile.emails[0].value) {
                //USER HAS PUBLIC GOOGLE MAIL
                var commonMail = profile.emails[0].value.toLowerCase();;
                //CHECK IF USER IS ALREADY SIGNED UP WITH FB
                User.findOne({'facebook.email' : commonMail}, function (err, user) {
                  if (err) throw err;
                  if (user) {
                    //USER HAS THE SAME EMAIL
                    user.provider = "google";
                    user.google.id    = profile.id;
                    user.google.token = accessToken;
                    user.google.name  = profile.displayName;
                    if (profile.photos && profile.photos[0] && profile.photos[0].value) {
                      if (!user.picture || user.picture === '') user.picture = profile.photos[0].value;
                      user.google.picture = profile.photos[0].value;
                    }
                    user.google.email = commonMail;

                    user.save(function(err) {
                        if (err) throw err;
                        return done(null, user);
                    });
                  } else {
                    var newUser = new User();
                    newUser.provider = "google";
                    newUser.google.id    = profile.id;
                    newUser.google.token = accessToken;
                    newUser.google.name  = profile.displayName;
                    newUser.picture  = profile.photos[0].value;
                    if (profile.photos && profile.photos[0] && profile.photos[0].value)
                      newUser.google.picture = profile._json.picture;
                    newUser.google.email = commonMail;
                    newUser.save(function(err) {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                  }
                });
              } else {
                //USER HAS NO PUBLIC GOOGLE MAIL
                var newUser = new User();
                newUser.provider = "google";
                newUser.google.id    = profile.id;
                newUser.google.token = accessToken;
                newUser.google.name  = profile.displayName;
                if (profile.photos && profile.photos[0] && profile.photos[0].value)
                  newUser.picture  = profile._json.picture;
                newUser.google.picture = profile._json.picture;
                newUser.save(function(err) {
                    if (err) throw err;
                    return done(null, newUser);
                });
              }
            }
          });
        } else {
          //USER IS ALREADY LOGGED IN
          return done(null, req.user);
        }
      });
    }
  ));


};

