var db = require('./db.js');


module.exports = {
  addUser: function (token, tokenSecret, profile, done){
    var err = '';
    db.child('users').child(profile.id).once('value', function (data) {
      if (data.val() === null){
        var user = {};
        //user.id = profile.id;
        user.tokenSecret = tokenSecret;
        user.token = token;
        user.name = profile._json.user.fullName;
        user.strideRunning = profile._json.user.strideLengthRunning;
        user.strideWalking = profile._json.user.strideLengthWalking;
        user.units = profile._json.user.distanceUnit;
        db.child('users').child(profile.id).set(user);
      } else {
        db.child('users').child(profile.id).update({tokenSecret: tokenSecret, token: token});
      }
      done(err, profile._json.user);
    });
  },
  getUserStats: function (user) {
    
  },
  addUserStats: function () {

  }


};