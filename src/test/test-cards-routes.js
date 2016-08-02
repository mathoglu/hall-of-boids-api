var chai = require('chai');
var chaiHttp = require('chai-http');
var chaiAsPromised = require("chai-as-promised");
var server = require('../../server');
var should = chai.should();
var config = require('../../config');
const sequelizeFixtures = require('sequelize-fixtures');
const db = require('../models/index');

chai.use(chaiHttp);
chai.use(chaiAsPromised);

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

describe('CardsRoutes', function() {
  describe('#list()', function() {
    var apiUrl = '/api/cards/';
    beforeEach(
      function (done) {
        initialiseDatabaseWithFixtures(done);
      }
    );
    it('should list all cards on /api/cards/ GET', function (done) {
      chai.request(server)
        .get(apiUrl)
        .end(function (err, res) {
          res.should.have.status(200);
          res.body._data.should.be.a('array');
          res.should.be.json;
          done();
        });
    });
    it('should return cards with the correct schema', function(done) {
      const cardsMapper = require('../mappers/cards.mapper');
      chai.request(server)
        .get(apiUrl)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body._data.should.be.a('array');
          cardsMapper.validate(res.body._data).then(function() {
              done();
            },
            function (err) {
              console.error("Card mapper validation failed");
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

      }
    );
    it('should list a single card on /api/cards/:card_id GET', function (done) {
      chai.request(server)
        .get('/api/cards/1')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          done();
        });
    });
    it('should return a single card with correct schema on /api/cards/:card_id GET', function (done) {
      const cardMapper = require('../mappers/cards.mapper');
      chai.request(server)
        .get('/api/cards/1')
        .end(function(err, res) {
          res.should.have.status(200);
          cardMapper.validate(res.body._data).then(function () {
              done();
            },
            function (err) {
              console.error("Card mapper validation failed");
              console.error(err);
              done(err);
            });
        });
    });
  });
});