var Promise = require('promise'),
  mapper = require('../mappers/skills.mapper').mapper,
  json = '{ "_data": [] }',
  models = require('../models/index');

function list() {
  var skillsPromise = models.skill.findAll();
  return skillsPromise.then(
    function(skills) {
      return skills;
    },
    function(err) {
      console.error(err);
    });
}

function get(id) {
  return models.skill.findById(id)
    .then( function (skill) {
      return skill;
    },
    function(err) {
      console.error(err);
    });
}

function post(skill) {
  var skillCreatePromise = models.employee.findOrCreate(
    {
      where: {
        name: skill.name
      },
      defaults: skill
    });
  return skillCreatePromise.then(function(skill) {
    return skill[0].dataValues.id;
  });
}

function patch(skillId, skillData) {
  if ("id" in skillData) {
    delete skillData.id;
  }
  return models.skill.update(skillData, {where: {id: skillId}}).then(
    function(data) {
    },
    function (err) {
      console.error(err);
    }
  )
}

function remove(skillId) {
  return models.project.destroy({where: {skillId: skillId}}).then(
    function() {
    },
    function(err) {
      console.error(err);
    }
  )
}

function convertDurationsToUnixTimestamp(skill) {
  skill.duration_from = skill.duration_from.getTime() / 1000;
  skill.duration_to = skill.duration_to.getTime() / 1000;
  return skill;
}


module.exports = {
  list: list,
  get: get,
  post: post,
  patch: patch,
  remove: remove
}