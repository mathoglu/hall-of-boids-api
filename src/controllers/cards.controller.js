var Promise = require('promise'),
  mapper = require('../mappers/cards.mapper').mapper,
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
  return buildCardsPromiseFromEmployeesPromise(employeesPromise);
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
    }).then(function(employee) {
      return [employee];
  });
  return buildCardsPromiseFromEmployeesPromise(employeePromise);
}

function buildCardFromEmployee(employee) {
  var card = {
    id: employee.id,
    info: {
      firstname: employee.first_name,
      lastname: employee.last_name,
      title: employee.title
    },
    image: employee.image,
    motto: employee.motto,
    available: false,
    inProcess: false,
    skills: employee.employeeSkills.map(function(employeeSkill) {
      return {
        rank: employeeSkill.rank,
        name: employeeSkill.skill.dataValues.name,
        rating: employeeSkill.rating
      }
    }),
    projects: employee.projects.map(function(project) {
      return {
        client: project.client,
        current: Date.now() > Date.parse(project.duration_from) && Date.now() < Date.parse(project.duration_to),
        description: project.description,
        duration: {
          from: Date.parse(project.duration_from) / 1000,
          to: Date.parse(project.duration_to) / 1000
        }
      }
    })
  };
  var hasCurrentProject = card.projects.some(function(project) {
    return project.current;
  });
  card.available = !hasCurrentProject;
  return mapper(JSON.stringify(card));
}

function buildCardPromiseFromEmployeePromise(employeePromise) {
  return employeePromise.then(function(employee) {
    return buildCardFromEmployee(employee);
  }, function(err) {
    console.error(err);
  });
}

function buildCardsPromiseFromEmployeesPromise(employeesPromise) {
  return employeesPromise.then(function(employees) {
    var cards = [];
    for (var i = 0; i < employees.length; i++) {
      cards.push(buildCardFromEmployee(employees[i].dataValues));
    }
    return Promise.all(cards);
  });
}

module.exports = {
  list: list,
  get: get
}
