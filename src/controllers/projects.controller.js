var Promise = require('promise'),
  mapper = require('../mappers/employees.mapper').mapper,
  json = '{ "_data": [] }',
  models = require('../models/index');

function list() {
  let projectsPromise = models.project.findAll(
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

function get(employee_id) {
  return models.project.findAll({where: {employee_id: employee_id}}).then( function (projects) {
    return projects.map((project) => convertDurationsToUnixTimestamp(project.dataValues));
  },
  function(err) {
    console.error(err);
  });
}

function post(project) {
  let projectCreatePromise = models.project.findOrCreate( {
      where: {
        client: project.client,
        employee_id: project.employee_id,
        description: project.description,
        duration_from: project.duration_from,
        duration_to: project.duration_to
      },
      defaults: project
    })
    .catch(err => {
      console.error(err)
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
      console.error(err);
    }
  )
}

function remove(projectId) {
  return models.project.destroy({where: {id: projectId}}).then(
    function() {
      console.log("destroyed");
    },
    function(err) {
      console.error(err);
    }
  )
}

function convertDurationsToUnixTimestamp(project) {
  project.duration_from = project.duration_from.getTime();
  project.duration_to = project.duration_to.getTime();
  return project;
}


module.exports = {
  list: list,
  get: get,
  post: post,
  patch: patch,
  remove: remove
};