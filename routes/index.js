var express = require('express');
var router = express.Router();
var passport = require('passport');
var FitbitStrategy = require('passport-fitbit').Strategy;
var db = require('../utils/db.js');
var dbHelper = require('../utils/dbHelpers.js');


if (!process.env.CONSUMER_KEY) {
  //keys.js conatains the Dev keys from fitbit
  //this statment makes the app work even if not being deployed
   var keys = require('../keys.js');
 } 

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


var url = '/auth/fitbit/callback';

passport.use(new FitbitStrategy({
  consumerKey: process.env.CONSUMER_KEY || keys.consumerKey,
  consumerSecret: process.env.CONSUMER_SECRET || keys.consumerSecret,
  callbackURL: url
},
function (token, tokenSecret, profile, done) {
  dbHelper.addUser(token, tokenSecret, profile, done);
  
}));

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
router.get('/login', function (req, res, next){
  res.redirect('/auth/fitbit');
});
router.get('/auth/fitbit', passport.authenticate('fitbit', {failureRedirect: '/login'}), function (req,res){});

router.get('/auth/fitbit/callback', passport.authenticate('fitbit', { failureRedirect: '/login' }), function (req, res, next) {
  //this line will redirect to the proper url after we create it
  res.redirect('/');
});

module.exports = router;
