const express = require('express'),
  responseMapper = require('../mappers/response.mapper'),
  employeesController = require('../controllers/employees.controller'),
  router = express.Router();

function _errorHandler(err, res, req) {
  console.error(err);
  res.status(500).json(responseMapper([], err));
}

router.route('/')
  .get(function(req,res) {
    employeesController.list().then(
      function(employees) {
        let employeesWithNoImage = [];
        if (req.query.no_image) {
          console.log(employees[0]);
          employees.forEach((employee) => {
            delete employee.image;
            employeesWithNoImage.push(employee);
          });
          employees = employeesWithNoImage;
        }
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
        if (req.query.no_image) {
          delete employee.image;
        }
        res.json(responseMapper(employee));
      },
      function (err) {
        _errorHandler(err, res, req);
      }
    );
  });

router.route('/:employee_id')
  .patch(function(req, res) {
    employeesController.patch(req.params.employee_id, req.body).then(function (data) {
        res.json(responseMapper(data));
      },
      function(err) {
        _errorHandler(err, res, req);
      }
    )
  });

router.route('/:employee_id')
  .delete(function(req, res) {
    employeesController.remove(req.params.employee_id, req.body).then(function(data) {
      res.json(responseMapper(data));
    },
    function(err) {
      _errorHandler(err,res,req);
    })
  });

router.route('/')
  .post(function(req, res) {
    employeesController.post(req.body).then(function(employeeId) {
      res.status(200).json(responseMapper(employeeId));
    },
    function(err) {
      _errorHandler(err, res, req);
    })
  });



module.exports = router;