const express = require('express'),
  responseMapper = require('../mappers/response.mapper'),
  skillsController = require('../controllers/skills.controller'),
  router = express.Router();

function _errorHandler(err, res, req) {
  res.status(500).json(responseMapper([], err));
}

router.route('/')
  .get(function(req,res) {
    skillsController.list().then(
      function(skills) {
        res.json(responseMapper(skills));
      },
      function(err) {
        _errorHandler(err, res, req);
      }
    );
  });

router.route('/:skill_id')
  .get(function(req,res) {
    skillsController.get(req.params.skill_id).then(
      function (skill) {
        res.json(responseMapper(skill));
      },
      function (err) {
        _errorHandler(err, res, req);
      }
    );
  });

module.exports = router;
