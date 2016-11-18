var Promise = require('promise'),
  json = '{ "_data": [] }',
  models = require('../models/index'),
  bcrypt = require('bcrypt'),
  config = require('../../config'),
  jwt = require('jwt-simple'),
  moment = require('moment');

function register(userInformation) {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        reject(err);
      }
      else {
        bcrypt.hash(userInformation.password, salt, function (err, hash) {
          if (err) {
            reject(err);
          }
          else {
            return models.user.findOrCreate({
              where: {
                username: userInformation.username,
                hash: hash,
                role: userInformation.role
              }
            }).catch(function(err) {
              console.error(err);
              throw err;
            }).then(function(user) {
              resolve(user[0].dataValues.id);
            })
          }
        })
      }
    });
  });
}

function authenticate(loginInformation) {
  return models.user.find({
    where: {
      username: loginInformation.username
    }
  }).then(function(user) {
    return new Promise(function(resolve, reject) {
      if (!user) {
        resolve(false);
      }
      var userPassword = loginInformation.password;
      var hashInDatabase = user.dataValues.hash;
      return bcrypt.compare(userPassword, hashInDatabase, function(err, isMatch) {
        if (err) {
          reject(err);
        }
        else {
          if (isMatch) {
            var payload = {
              sub: user.dataValues.id,
              username: user.dataValues.username,
              exp: moment().add(7, 'days').format()
            };
            var token = jwt.encode(payload, config.passport_auth.secret_key);
            resolve(token);
          }
          else {
            resolve(null);
          }
        }
      })
    });
  })
}

module.exports = {
  register: register,
  authenticate: authenticate
};