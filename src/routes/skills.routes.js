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

router.route('/:employee_id')
  .get(function(req,res) {
    skillsController.get(req.params.employee_id).then(
      function (skill) {
        res.json(responseMapper(skill));
      },
      function (err) {
        _errorHandler(err, res, req);
      }
    );
  });

router.route('/')
  .post(function(req,res) {
    skillsController.post(req.body).then(
      function(skillId) {
        res.json(responseMapper(skillId));
      },
      function (err) {
        _errorHandler(err, res, req);
      }
    )
  });

router.route('/:skill_id')
  .patch(function(req, res) {
    skillsController.patch(req.params.skill_id, req.body)
      .then(
        function (skill) {
          res.json(responseMapper(skill));
        },
        function(err) {
          _errorHandler(err, res, req);
        }
      );
  });

router.route('/:skill_id')
  .delete(function(req, res) {
    skillsController.remove(req.params.skillId)
      .then(
        data => {
          res.json(responseMapper(data));
        },
        err => {
          _errorHandler(err, res, req);
        }
      )
  });

module.exports = router;
