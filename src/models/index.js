var fs = require('fs');
var path = require("path");
var Sequelize = require('sequelize');
var config = require('../../config');
var sequelize = new Sequelize(config.database.name,
  config.database.user,
  config.database.password,
  {dialect: config.database.dialect});

if (process.env.ENVIRONMENT === 'test') {
  sequelize = new Sequelize(config.test_database.name,
  config.test_database.user,
  config.test_database.password,
    {dialect: config.test_database.dialect});
}

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

if (process.env.ENVIRONMENT === 'development') {
  sequelize.sync({force: true}).then(function () {
    const sequelizeFixtures = require('sequelize-fixtures');
    var files = [
      'fixtures/static_data/employees.json',
      'fixtures/static_data/projects.json',
      'fixtures/static_data/skills.json',
      'fixtures/static_data/employee_skills.json'
    ];
    sequelizeFixtures.loadFiles(files, db).then(function () {
      console.log("Fixtures loaded");
    });
  });
}
else if (process.env.ENVIRONMENT === 'production') {
  sequelize.sync().then(function() {
    console.log("Database synced");
  })
}


module.exports = db;
db.sequelize = sequelize;
module.exports.sequelize = sequelize;
db.Sequelize = Sequelize;
