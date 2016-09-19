"use strict";

module.exports = function (sequelize, DataTypes) {
  var Employee = sequelize.define('employee', {
    first_name: {
      type: DataTypes.STRING,
      field: 'first_name'
    },
    last_name: {
      type: DataTypes.STRING,
      field: 'last_name'
    },
    title: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    motto: {
      type: DataTypes.TEXT
    }
  }, {
    classMethods: {
      associate: function(models) {
        Employee.hasMany(models.employeeSkill);
        Employee.belongsToMany(models.project, {
          through: "employeeProjects",
          foreign_key: "employeeId"
        });
      }
    }
  });
  return Employee;
};