"use strict";

module.exports = function (sequelize, DataTypes) {
  var Project = sequelize.define('project', {
    client: {
      type: DataTypes.STRING,
      field: 'client'
    },
    description: {
      type: DataTypes.TEXT,
      field: 'description'
    },
    duration_from: {
      type: DataTypes.DATE,
      field: 'duration_from'
    },
    duration_to: {
      type: DataTypes.DATE,
      field: 'duration_to'
    }
  },
  {
    classMethods: {
      associate: function(models) {
        Project.hasMany(models.skill);
        Project.belongsToMany(models.employee, {
          through: "employeeProjects", foreignKey: "projectId"
        });
      }
    }
  });
  return Project;
};