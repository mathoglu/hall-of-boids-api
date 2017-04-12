var Promise = require('promise'),
  mapper = require('../mappers/cards.mapper').mapper,
  json = '{ "_data": [] }',
  models = require('../models/index');

function list() {
  let employeesPromise = models.employee.findAll()
    .then(employees => {
      return models.project.findAll().then(projects => {
        return models.skill.findAll().then(skills => {
          let res = mapSkillsAndProjectsToEmployees(employees, projects, skills);
          return res;
        })
      })
    })
    .catch(err => console.error(err));
  return buildCardsPromiseFromEmployeesPromise(employeesPromise);
}

function listIds() {
  let idsPromise = models.employee.findAll({ attributes: ['id']});
  return idsPromise.then((idRecords) => {
    let ids = idRecords.map((r) => r.dataValues.id).sort((a,b) => a-b);
    return ids;
  })
}

function mapSkillsAndProjectsToEmployees(employees, projects, skills) {
  return employees.map(employee => {
    let employeeSkills = skills.filter(skill => {
      return skill.dataValues.employee_id === parseInt(employee.dataValues.id, 10);
    }).map(skill => skill.dataValues);

    let employeeProjects = projects.filter(project => {
      return project.dataValues.employee_id === parseInt(employee.dataValues.id, 10);
    }).map(project => project.dataValues);

    employee.dataValues.skills = employeeSkills;
    employee.dataValues.projects = employeeProjects;
    return employee;
  });
}

function get(id) {
  let employeePromise = models.employee.findById(id)
    .then(employee => {
      if (!employee) {
        return Promise.resolve(null);
      }
      return models.project.findAll({where: {employee_id: id}})
        .then(projects => {
          return models.skill.findAll({where: {employee_id: id}}).then(skills => {
            employee.dataValues.skills = skills.map(skill => skill.dataValues);
            employee.dataValues.projects = projects.map(skill=> skill.dataValues);
            return [employee];
          })
        });
    })
    .catch(err => console.error(err));
  return buildCardsPromiseFromEmployeesPromise(employeePromise);
}

function buildCardFromEmployeeData(employee) {
  let card = {
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
    skills: employee.skills.map(skill => {
      return {
        name: skill.name,
        rating: skill.rating,
      };
    }),
    projects: employee.projects.map(project => {
      return {
        client: project.client,
        current: Date.now() > Date.parse(project.duration_from) && Date.now() < Date.parse(project.duration_to),
        description: project.description,
        duration: {
          from: Date.parse(project.duration_from),
          to: Date.parse(project.duration_to)
        }
      };
    })
  };
  let hasCurrentProject = card.projects.some(function(project) {
    return project.current;
  });
  card.available = !hasCurrentProject;
  return mapper(JSON.stringify(card));
}

function buildCardPromiseFromEmployeePromise(employeePromise) {
  return employeePromise.then(function(employee) {
    return buildCardFromEmployeeData(employee);
  }, function(err) {
    console.error(err);
  });
}

function buildCardsPromiseFromEmployeesPromise(employeesPromise) {
  return employeesPromise.then(function(employees) {
    if (!employees) {
      return null;
    }
    else {
      let cards = [];
      for (let i = 0; i < employees.length; i++) {
        cards.push(buildCardFromEmployeeData(employees[i].dataValues));
      }
      return Promise.all(cards);
    }
  });
}

module.exports = {
  list: list,
  listIds: listIds,
  get: get
};
