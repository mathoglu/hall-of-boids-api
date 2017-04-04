const Promise = require('promise'),
  Joi = require('joi'),
  json = '{ "_data": [] }',
  models = require('../models/index');

const projectSchema = Joi.object().keys({
  id: Joi.number().required(),
  employee_id: Joi.number().required(),
  client: Joi.string().required(),
  current: Joi.boolean(),
  description: Joi.string(),
  duration_from: Joi.date().timestamp('unix'),
  duration_to: Joi.date().timestamp('unix')
});
const projectsSchema = Joi.array().min(0).items(projectSchema);

function _errorHandler(err, reject) {
  console.error(err.name, err.details);
  reject(err);
}

function validateSchema(item, schema) {
  return new Promise(function(resolve, reject) {
    Joi.validate(item, schema, {stripUnknown: true},  function(err, val) {
      if (err)
        _errorHandler(err, reject);
      resolve(val)
    })
  })
}

function validateProject(project) {
  return validateSchema(project, projectSchema);
}

function validateProjects(projects) {
  if (Array.isArray(projects)) {
    return validateSchema(projects, projectsSchema);
  }
  else {
    return validateSchema(projects, projectSchema);
  }
}

function projectsMapper(items) {
  if (Array.isArray(items)) {
    return validateProjects(items)
      .map(project => {
        project.duration_from = dateToUnixTimestamp(project.duration_from);
        project.duration_to = dateToUnixTimestamp(project.duration_to);
      });
  }
  else {
    return validateProject(items);
  }
}

function dateToUnixTimestamp(date) {
  return Date.parse(date) / 1000;
}

module.exports = {
  schema: projectSchema,
  mapper: projectsMapper,
  validate: validateProjects
};
