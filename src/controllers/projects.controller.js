var Promise = require('promise'),
  mapper = require('../mappers/employees.mapper').mapper,
  json = '{ "_data": [] }',
  models = require('../models/index');

function list() {
  var projectsPromise = models.project.findAll(
    {
      include: [
        {
          model: models.skill,
        }
      ]
    });
  return projectsPromise.then(
    function(projects) {
      return projects.map(function(project) {
        return convertDurationsToUnixTimestamp(project.dataValues);
      })
    },
    function(err) {
      console.error(err);
    });
}

function get(id) {
  return models.project.findById(id,
    {
      include: [
        models.skill
      ]
    }
  ).then( function (project) {
    return convertDurationsToUnixTimestamp(project.dataValues);
  },
  function(err) {
    console.error(err);
  });
}

function convertDurationsToUnixTimestamp(project) {
  project.duration_from = project.duration_from.getTime() / 1000;
  project.duration_to = project.duration_to.getTime() / 1000;
  return project;
}


module.exports = {
  list: list,
  get: get
}