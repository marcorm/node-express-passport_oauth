var express = require('express');
var router = express.Router();
var passport = require('passport');

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/google',
  passport.authenticate('google', { scope : ['profile', 'email'] }),
  function(req, res, next){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/google/callback', function(req, res, next) {
  passport.authenticate('google', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.redirect('/');
    req.logIn(user, function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  })(req, res, next);
});

router.get('/facebook',
  passport.authenticate('facebook', { scope : ['email'] }),
  function(req, res, next){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

  router.get('/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.redirect('/');
        req.logIn(user, function(err) {
            return res.redirect('/');
        });
    })(req, res, next);
  });


router.get('/amilogged', function(req, res, next) {
    if (req.isAuthenticated())
        res.json({'auth':true});
    else
        res.json({'auth':false});
});

router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});


module.exports = router;