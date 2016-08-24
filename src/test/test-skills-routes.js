var chai = require('chai');
var chaiHttp = require('chai-http');
var chaiAsPromised = require("chai-as-promised");
var server = require('../../server');
var should = chai.should();
var config = require('../../config');
const sequelizeFixtures = require('sequelize-fixtures');
const db = require('../models/index');
const skillsMapper = require('../mappers/skills.mapper');

chai.use(chaiHttp);
chai.use(chaiAsPromised);

var apiUrl = '/api/skills/';

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

describe('SkillsRoutes', function() {
  describe('#list()', function() {
    beforeEach(
      function (done) {
        initialiseDatabaseWithFixtures(done);
      },
      function(err) {
        console.error("Fixture loading failed");
        console.error(err);
        console.error(err.stack);
      }
    );
    it('should list all skills on /api/skills/ GET', function (done) {
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
    it('should return skills with the correct schema', function(done) {
      chai.request(server)
        .get(apiUrl)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body._data.should.be.a('array');
          skillsMapper.validate(res.body._data).then(function() {
              done();
            },
            function (err) {
              console.error("Skill mapper validation failed");
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
    it('should return a single skill on /api/skills/:skill_id GET', function (done) {
      chai.request(server)
        .get(apiUrl + '1')
        .end(function(err, res) {
          res.should.have.status(200);
          res.body._data.should.not.be.a('array');
          res.should.be.json;
          skillsMapper.validate(res.body._data).then(
            function () {
              done();
            },
            function (err) {
              console.error("Skill mapper validation failed");
              console.error(err);
              done(err);
            });
        });
    });
  });
  describe('#patch(id)', function() {
    beforeEach(
      function (done) {
        initialiseDatabaseWithFixtures(done);
      },
      function(err) {
        console.error("Database initialization failed");
        console.error(err);
      }
    );
    it('should update the record corresponding to the id with the given data', function(done) {
      var skillId = 1;
      var skill = {
        name: "New Skillname"
      };
      chai.request(server)
        .patch(apiUrl + '1')
        .send(skill)
        .end(function(err, res) {
          res.should.have.status(200);
          db.skill.findById(skillId).then(function(dbEmployee) {
            dbEmployee.name.should.equal(skill.name);
            done();
          }, function(err) {
            done(err);
          });
        })
    })
  })
});
