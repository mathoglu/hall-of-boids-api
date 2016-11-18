var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
var models = require('../models/index');
var config = require('../../config');
var moment = require('moment');

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.passport_auth.secret_key;

  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    return models.user.findById(jwt_payload.sub).then(function (user) {
      if (user) {
        var isExpired = moment().isAfter(moment(jwt_payload.exp));
        if (!isExpired) {
          done(null, user);
        }
      }
      else {
        done(null, false, {message: "User ID not found"});
      }
    }).catch(function(err) {
      console.error(err);
      done(err, false);
    });
  }));
};