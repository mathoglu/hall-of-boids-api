var Promise = require('promise'),
  mapper = require('../mappers/employees.mapper').mapper,
  json = '{ "_data": [] }',
  models = require('../models/index');

function list() {
  let employeesPromise = models.employee.findAll();
  return employeesPromise.then(function(employees) {
    return employees.map(function(employee) {
      return employee.dataValues;
    })
  })
}

function get(id) {
  let employeePromise = models.employee.findById(id);
  return employeePromise.then( function (employee) {
    return employee.dataValues;
  });
}

function post(employee) {
  let employeeCreatePromise = models.employee.findOrCreate(
    {
      where: {
        first_name: employee.first_name,
        last_name: employee.last_name
      },
      defaults: employee
    })
    .catch(err => console.error(err));
  return employeeCreatePromise.then(function(employee) {
    return employee[0].dataValues.id;
  })
}

function patch(employeeId, employeeData) {
  if ("id" in employeeData) {
    delete employeeData.id;
  }
  return models.employee.update(employeeData, {where: {id: employeeId}}).then(
    function(data) {
      console.log(data);
    },
    function (err) {
      console.error(err);
    }
  );
}

function remove(employeeId) {
  // first destroy the employee skill instances for the employee
  // before destroying the employee instance
  return models.employeeSkill.destroy({where: {employeeId: employeeId}}).then(function() {
    return models.employee.destroy({where: {id: employeeId}}).then(
      function () {
        console.log("destroyed");
      },
      function (err) {
        console.error(err);
      }
    )
  },
  function(err) {
    console.error(err);
  });
}

module.exports = {
  list: list,
  get: get,
  post: post,
  patch: patch,
  remove: remove
};