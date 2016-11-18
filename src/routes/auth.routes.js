var express = require('express'),
  responseMapper = require('../mappers/response.mapper'),
  userController = require('../controllers/users.controller'),
  router = express.Router(),
  passport = require('passport');

function _errorHandler(err, res, req) {
  res.status(500).json(responseMapper([], err));
}

router.route('/register')
  .post(function(req, res) {
    if (!req.body.username || !req.body.password) {
      return false;
    }
    var userInformation = {
      username: req.body.username,
      password: req.body.password,
      role: req.body.role
    };
    userController.register(userInformation).then(function(userId) {
      res.status(200).json(responseMapper(userId));
    },
    function(err) {
      _errorHandler(err, res);
    });
  });

router.route('/login')
  .post(function(req, res) {
    if (!req.body.username || !req.body.password) {
      _errorHandler("Invalid username and/or password", res);
    }
    var loginInformation = {
      username: req.body.username,
      password: req.body.password
    };
    userController.authenticate(loginInformation).then(function(jwt) {
      if (jwt) {
        res.status(200).json(responseMapper({token: jwt}))
      }
      else {
        _errorHandler("Invalid username and/or password", res);
      }
    })
  });

module.exports = router;