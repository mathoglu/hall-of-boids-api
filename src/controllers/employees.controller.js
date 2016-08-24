var Promise = require('promise'),
  mapper = require('../mappers/employees.mapper').mapper,
  json = '{ "_data": [] }',
  models = require('../models/index');

function list() {
  var employeesPromise = models.employee.findAll(
    {
      include: [
        {
          model: models.employeeSkill,
          include: [ models.skill ]
        },
        models.project
      ]
    });
  return employeesPromise.then(function(employees) {
    return employees.map(function(employee) {
      return employee.dataValues;
    })
  })
}

function get(id) {
  var employeePromise = models.employee.findById(id,
    {
      include: [
        {
          model: models.employeeSkill,
          include: [ models.skill ]
        },
        models.project
      ]
    });
  return employeePromise.then( function (employee) {
    return employee.dataValues;
  });
}

function post(employee) {
  var employeeCreatePromise = models.employee.findOrCreate(
    {
      where: {
        first_name: employee.first_name,
        last_name: employee.last_name
      },
      defaults: employee
    });
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