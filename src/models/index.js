var fs = require('fs');
var path = require("path");
var Sequelize = require('sequelize');
var config = require('../../config');

var sequelize;

if (process.env.ENVIRONMENT === 'test') {
  sequelize = new Sequelize(config.test_database.name,
  config.test_database.user,
  config.test_database.password,
    {dialect: config.test_database.dialect});
}
else {
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {dialect: config.database.dialect});
  }
  else {
    sequelize = new Sequelize(config.database.name,
      config.database.user,
      config.database.password,
      {dialect: config.database.dialect});
  }
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
      'fixtures/static_data/skills.json'
    ];
    sequelizeFixtures.loadFiles(files, db).then(function () {
      console.log("Fixtures loaded");
      fs.readFile('fixtures/static_data/employee_images.json', 'utf-8', function(err, dataJson) {
        var dataArray = JSON.parse(dataJson);
        for (var i = 0; i < dataArray.length; i++) {
          var id = dataArray[i].employee_id;
          var b64data = dataArray[i].data;
          db.employee.update({image: b64data}, {where: {id: id}, logging: false}).then(function() {
            console.log("Image uploaded to database");
          }).catch(function(err) {
            console.error("Error loading image to database");
            console.error(err);
          });
        }
      });
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
