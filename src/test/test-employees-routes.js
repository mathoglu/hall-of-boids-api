var chai = require('chai');
var chaiHttp = require('chai-http');
var chaiAsPromised = require("chai-as-promised");
var server = require('../../server');
var should = chai.should();
var config = require('../../config');
const sequelizeFixtures = require('sequelize-fixtures');
const db = require('../models/index');
const employeesMapper = require('../mappers/employees.mapper');

chai.use(chaiHttp);
chai.use(chaiAsPromised);

var apiUrl = '/api/employees/';

function logAndFailOnError(err) {
  console.error(err);
  console.error(err.stack);
  assert.fail();
}

function initialiseDatabaseWithFixtures(done) {
  return db.sequelize.sync({force: true}).then(
    function () {
      var test_fixtures = ['fixtures/test_data.json'];
      sequelizeFixtures.loadFiles(test_fixtures, db).then(function () {
          console.log("Fixtures loaded");
          done();
        },
        logAndFailOnError);
    },
    function(err) { console.log(err); }
  );
}

function resetDatabase() {
  return db.sequelize.drop().then(function() {
      console.log("Database dropped");
    },
    logAndFailOnError);
}

describe('EmployeesRoutes', function() {
  describe('#list()', function() {
    beforeEach(
      function (done) {
        initialiseDatabaseWithFixtures(done);
      },
      function(err) {

      }
    );
    it('should list all employees on /api/employees/ GET', function (done) {
      chai.request(server)
        .get(apiUrl)
        .end(function (err, res) {
          res.should.have.status(200);
          res.body._data.should.be.a('array');
          res.should.be.json;
          res.body._data.length.should.be.above(1);
          done();
        });
    });
    it('should return employees with the correct schema', function(done) {
      chai.request(server)
        .get(apiUrl)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body._data.should.be.a('array');
          employeesMapper.validate(res.body._data).then(function() {
              done();
            },
            logAndFailOnError
          ).should.eventually.equal(true);
        });
    });
  });

  describe('#get(id)', function() {
    beforeEach(
      function (done) {
        initialiseDatabaseWithFixtures(done);
      },
      function(err) {
        console.error("Database initialization failed");
        console.error(err);
      }
    );
    it('should return a single employee on /api/employees/:employee_id GET', function (done) {
      chai.request(server)
        .get(apiUrl + '1')
        .end(function(err, res) {
          res.should.have.status(200);
          res.body._data.should.not.be.a('array');
          res.should.be.json;
          employeesMapper.validate(res.body._data).then(
            function () {
              done();
            },
            logAndFailOnError);
        });
    });
  });
  describe('#post(employee)', function () {
    beforeEach(
      function (done) {
        initialiseDatabaseWithFixtures(done);
      },
      logAndFailOnError
    );
    it('should create an employee with the given data', function (done) {
      var employee = {
        first_name: 'Postesti',
        last_name: 'Posteljooni',
        title: 'Postman',
        image: '',
        motto: 'Go big or go home.'
      };
      chai.request(server)
        .post(apiUrl)
        .send(employee)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have._data;
          res.body._data.should.be.a('number');
          var employeeId = res.body._data;
          db.employee.findById(employeeId).then(function(dbEmployee) {
            dbEmployee.first_name.should.equal(employee.first_name);
            dbEmployee.last_name.should.equal(employee.last_name);
            dbEmployee.title.should.equal(employee.title);
            dbEmployee.image.should.equal(employee.image);
            dbEmployee.motto.should.equal(employee.motto);
            done();
          },
          function(err) {
            done(err);
          });
        });
    });
  });

  describe('#patch(employeeId)', function () {
    beforeEach(
      function (done) {
        initialiseDatabaseWithFixtures(done);
      },
      logAndFailOnError
    );
    it('should update the record corresponding to the employeeId with the given data', function (done) {
      var employeeId = 1;
      var employee = {
        first_name: 'Postesti',
        last_name: 'Posteljooni',
        title: 'Postman',
        image: '',
        motto: 'Go big or go home.'
      };
      chai.request(server)
        .patch(apiUrl + employeeId)
        .send(employee)
        .end(function(err, res) {
          res.should.have.status(200);
          db.employee.findById(employeeId).then(function(dbEmployee) {
              dbEmployee.first_name.should.equal(employee.first_name);
              dbEmployee.last_name.should.equal(employee.last_name);
              dbEmployee.title.should.equal(employee.title);
              dbEmployee.image.should.equal(employee.image);
              dbEmployee.motto.should.equal(employee.motto);
              done();
            },
            function(err) {
              done(err);
            });
        });
    });
  });

  describe('#remove(employeeId)', function() {
    beforeEach(
      function (done) {
        initialiseDatabaseWithFixtures(done);
      },
      logAndFailOnError
    );
    it('should remove the record corresponding to the employeeId', function(done) {
      var employeeId = 1;
      chai.request(server)
        .delete(apiUrl + employeeId.toString())
        .end(function(err, res) {
          res.should.have.status(200);
          db.employee.findById(employeeId).then(function(dbEmployee) {
            should.not.exist(dbEmployee);
          },
          function(err) {
            console.error(err);
            assert.fail();
          }).then(function() {
            db.employeeSkill.findAll({where: {employeeId: employeeId}}).then(function(dbEmployeeSkills) {
              dbEmployeeSkills.length.should.equal(0);
              done();
            },
              logAndFailOnError);
          })
        })
    })
  })
});
