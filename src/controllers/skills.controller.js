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

function convertDurationsToUnixTimestamp(skill) {
  skill.duration_from = skill.duration_from.getTime() / 1000;
  skill.duration_to = skill.duration_to.getTime() / 1000;
  return skill;
}


module.exports = {
  list: list,
  get: get
}