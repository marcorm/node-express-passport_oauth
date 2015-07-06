
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');

var User = require('../BE/models/user');

module.exports = function(passport) {

  // API Access link for creating client ID and secret:
  // https://code.google.com/apis/console/
  var GOOGLE_CLIENT_ID = configAuth.googleAuth.clientID;
  var GOOGLE_CLIENT_SECRET = configAuth.googleAuth.clientSecret;
  var GOOGLE_CALLBACK_URL = configAuth.googleAuth.callbackURL;
  var FACEBOOK_CLIENT_ID = configAuth.facebookAuth.clientID;
  var FACEBOOK_CLIENT_SECRET = configAuth.facebookAuth.clientSecret;
  var FACEBOOK_CALLBACK_URL = configAuth.facebookAuth.callbackURL;

  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /*
  *******************
  * GOOGLE
  *******************
  */
  // Use the GoogleStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, the request, an accessToken, refreshToken, and Google
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

        if (req.user) {
          //USER IS ALREADY LOGGED IN
          return done(null, req.user);

        } else if (!req.user) {
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
                User.findOne({'email' : commonMail}, function (err, user) {
                  if (err) throw err;
                  if (user) {
                      //USER HAS THE SAME EMAIL OF ANOTHER PROVIDER
                      user.provider = "google";
                      user.google.id    = profile.id;
                      user.google.token = accessToken;
                      user.google.name  = profile.displayName;
                      if (profile.photos && profile.photos[0] && profile.photos[0].value) {
                        if (!user.picture || user.picture === '') user.picture = profile.photos[0].value.split('?')[0]; //get rid of ?sz=50
                        user.google.picture = profile.photos[0].value.split('?')[0];
                      }
                      user.loginCount ++;
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
                    if (profile.photos && profile.photos[0] && profile.photos[0].value) {
                      newUser.picture  = profile.photos[0].value.split('?')[0];
                      newUser.google.picture = profile.photos[0].value.split('?')[0];
                    } 
                    newUser.email = commonMail;
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
                  if (profile.photos && profile.photos[0] && profile.photos[0].value) {
                    newUser.picture  = profile.photos[0].value.split('?')[0];
                    newUser.google.picture = profile.photos[0].value.split('?')[0];
                  }
                  newUser.save(function(err) {
                    if (err) throw err;
                    return done(null, newUser);
                  });
                }
              }
            });
          }
        });
    }
  ));

  /*
  *******************
  * FACEBOOK
  *******************
  */
  passport.use(new FacebookStrategy({
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: FACEBOOK_CALLBACK_URL,
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        if (req.user) {
          //USER IS ALREADY LOGGED IN
          return done(null, req.user);

        } else if (!req.user) {
          //USER IS NOT LOGGED IN
          User.findOne({'facebook.id' : profile.id}, function(err, user) {
            if (err) return done(err);
            if (user) {
              //LOGIN
              user.provider = 'facebook';
              user.facebook.token = accessToken;
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
                User.findOne({'email' : commonMail}, function (err, user) {
                  if (err) throw err;
                  if (user) {
                      //USER HAS THE SAME EMAIL OF ANOTHER PROVIDER
                      user.provider = "facebook";
                      user.facebook.id    = profile.id;
                      user.facebook.token = accessToken;
                      user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                      if (!user.picture || user.picture === '') user.picture = 'https://graph.facebook.com/'+profile.id+'/picture?height=200&type=normal&width=200';
                      user.facebook.picture = 'https://graph.facebook.com/'+profile.id+'/picture?height=200&type=normal&width=200';
                      user.loginCount ++;
                      user.save(function(err) {
                        if (err) throw err;
                        return done(null, user);
                      });
                  } else {
                    var newUser = new User();
                    newUser.provider = "facebook";
                    newUser.facebook.id    = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.picture = 'https://graph.facebook.com/'+profile.id+'/picture?height=200&type=normal&width=200';
                    newUser.picture = 'https://graph.facebook.com/'+profile.id+'/picture?height=200&type=normal&width=200';
                    newUser.email = commonMail;
                    newUser.save(function(err) {
                      if (err) throw err;
                      return done(null, newUser);
                    });
                  }
                });
              } else {
                  //USER HAS NO PUBLIC GOOGLE MAIL
                  var newUser = new User();
                  newUser.provider = "facebook";
                  newUser.facebook.id    = profile.id;
                  newUser.facebook.token = accessToken;
                  newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                  newUser.facebook.picture = 'https://graph.facebook.com/'+profile.id+'/picture?height=200&type=normal&width=200';
                  newUser.picture = 'https://graph.facebook.com/'+profile.id+'/picture?height=200&type=normal&width=200'; 
                  newUser.save(function(err) {
                    if (err) throw err;
                    return done(null, newUser);
                  });
                }
              }
            });
          }
        });
    }
  ));

};

