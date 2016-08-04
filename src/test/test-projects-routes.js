var chai = require('chai');
var chaiHttp = require('chai-http');
var chaiAsPromised = require("chai-as-promised");
var server = require('../../server');
var should = chai.should();
var config = require('../../config');
const sequelizeFixtures = require('sequelize-fixtures');
const db = require('../models/index');
const projectsMapper = require('../mappers/projects.mapper');

chai.use(chaiHttp);
chai.use(chaiAsPromised);

var apiUrl = '/api/projects/';

function initialiseDatabaseWithFixtures(done) {
  return db.sequelize.sync({force: true}).then(
    function () {
      var test_fixtures = ['fixtures/test_data.json'];
      sequelizeFixtures.loadFiles(test_fixtures, db).then(function () {
          console.log("Fixtures loaded");
          done();
        },
        function(err) {
          console.error("Fixture loading failed");
          console.error(err);
          console.error(err.stack);
        });
    },
    function(err) { console.log(err); }
  );
}

function resetDatabase() {
  return db.sequelize.drop().then(function() {
      console.log("Database dropped");
    },
    function (err) {
      console.error("Database drop failed");
      console.error(err);
    });
}

describe('ProjectsRoutes', function() {
  describe('#list()', function() {
    beforeEach(
      function (done) {
        initialiseDatabaseWithFixtures(done);
      },
      function(err) {

      }
    );
    it('should list all projects on /api/projects/ GET', function (done) {
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
    it('should return projects with the correct schema', function(done) {
      chai.request(server)
        .get(apiUrl)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body._data.should.be.a('array');
          projectsMapper.validate(res.body._data).then(function() {
              done();
            },
            function (err) {
              console.error("Project mapper validation failed");
              console.error(err);
              done(err);
            }
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
    it('should return a single project on /api/projects/:project_id GET', function (done) {
      chai.request(server)
        .get(apiUrl + '1')
        .end(function(err, res) {
          res.should.have.status(200);
          res.body._data.should.not.be.a('array');
          res.should.be.json;
          projectsMapper.validate(res.body._data).then(
            function () {
              done();
            },
            function (err) {
              console.error("Project mapper validation failed");
              console.error(err);
              done(err);
            });
        });
    });
  });
});
