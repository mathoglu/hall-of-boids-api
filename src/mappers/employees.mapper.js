var Promise = require('promise'),
  Joi = require('joi'),
  json = '{ "_data": [] }',
  models = require('../models/index');

var employeeSchema = Joi.object().keys({
  id: Joi.number().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string(),
  title: Joi.string(),
  image: Joi.string(),
  motto: Joi.string()
});
var employeesSchema = Joi.array().min(0).items(employeeSchema);

function _errorHandler(err, reject) {
  console.error(err.name, err.details);
  reject(err);
}

function validateSchema(item, schema) {
  return new Promise(function(resolve, reject) {
    Joi.validate(item, schema, { stripUnknown: true }, function(err, val) {
      if (err) _errorHandler(err, reject);
      resolve(val)
    })
  })
}

function validateEmployee(employee) {
  return validateSchema(employee, employeeSchema);
}

function validateEmployees(employees) {
  if (Array.isArray(employees)) {
    return validateSchema(employees, employeesSchema);
  }
  else {
    return validateSchema(employees, employeeSchema);
  }
}

function employeesMapper(items) {
  if (Array.isArray(items)) {
    return validateEmployees(items);
  }
  else {
    return validateEmployee(items);
  }
}

module.exports = {
  schema: employeeSchema,
  mapper: employeesMapper,
  validate: validateEmployees
}