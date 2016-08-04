const express = require('express'),
  responseMapper = require('../mappers/response.mapper'),
  employeesController = require('../controllers/employees.controller'),
  router = express.Router();

function _errorHandler(err, res, req) {
  res.status(500).json(responseMapper([], err));
}

router.route('/')
  .get(function(req,res) {
    employeesController.list().then(
      function(employees) {
        res.json(responseMapper(employees));
      },
      function(err) {
        _errorHandler(err, res, req);
      }
    );
  });

router.route('/:employee_id')
  .get(function(req,res) {
    employeesController.get(req.params.employee_id).then(
      function (employee) {
        res.json(responseMapper(employee));
      },
      function (err) {
        _errorHandler(err, res, req);
      }
    );
  });

module.exports = router;
