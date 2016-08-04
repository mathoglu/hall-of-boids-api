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
  var employeeCreatePromise = models.employee.findOrCreate();
}


module.exports = {
  list: list,
  get: get
}