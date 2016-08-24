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

function post(project) {
  var projectCreatePromise = models.project.findOrCreate( {
    where: {
      client: project.client,
      description: project.description,
      duration_from: project.duration_from,
      duration_to: project.duration_to
    },
    defaults: project
  });
  return projectCreatePromise.then(function(project) {
    return project[0].dataValues.id;
  })
}

function patch(projectId, projectData) {
  if ("id" in projectData) {
    delete projectData.id;
  }
  return models.project.update(projectData, {where: {id: projectId}}).then(
    function(data) {
      console.log(data);
    },
    function(err) {
      console.log(err);
    }
  )
}

function remove(projectId) {
  return models.project.destroy({where: {projectId: projectId}}).then(
    function() {
      console.log("destroyed");
    },
    function(err) {
      console.error(err);
    }
  )
}

function convertDurationsToUnixTimestamp(project) {
  project.duration_from = project.duration_from.getTime() / 1000;
  project.duration_to = project.duration_to.getTime() / 1000;
  return project;
}


module.exports = {
  list: list,
  get: get,
  post: post,
  patch: patch,
  remove: remove
}