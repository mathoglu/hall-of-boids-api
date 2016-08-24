const express = require('express'),
  responseMapper = require('../mappers/response.mapper'),
  projectsController = require('../controllers/projects.controller'),
  router = express.Router();

function _errorHandler(err, res, req) {
  res.status(500).json(responseMapper([], err));
}

router.route('/')
  .get(function(req,res) {
    projectsController.list().then(
      function(projects) {
        res.json(responseMapper(projects));
      },
      function(err) {
        _errorHandler(err, res, req);
      }
    );
  });

router.route('/')
  .post(function(req, res) {
    projectsController.post(req.body).then(function(projectId) {
      res.json(responseMapper(projectId));
    },
    function(err) {
      _errorHandler(err, res, req);
    })
  });

router.route('/:project_id')
  .get(function(req,res) {
    projectsController.get(req.params.project_id).then(
      function (project) {
        res.json(responseMapper(project));
      },
      function (err) {
        _errorHandler(err, res, req);
      }
    );
  });

router.route('/:project_id')
  .patch(function(req, res) {
    projectsController.patch(req.params.project_id, req.body).then(
      function (data) {
        res.json(responseMapper(data))
      },
      function (err) {
        _errorHandler(err, res, req);
      }
    );
  });

module.exports = router;
