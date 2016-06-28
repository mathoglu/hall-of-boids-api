var fs = require('fs');
var path = require("path");
var Sequelize = require('sequelize');
var config = require('../../config');
var sequelize = new Sequelize(config.database.name,
  config.database.user,
  config.database.password,
  {dialect: config.database.dialect});

var db = {};

// import and associate models
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});


sequelize.sync({force: true, match: /_test$/ }).then(function () {
  const sequelizeFixtures = require('sequelize-fixtures');
  sequelizeFixtures.loadFile('fixtures/*.json', db).then(function () {
    console.log("Fixtures loaded");
  });
});


module.exports = db;
db.sequelize = sequelize;
module.exports.sequelize = sequelize;
db.Sequelize = Sequelize;
