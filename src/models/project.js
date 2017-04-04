"use strict";

module.exports = function (sequelize, DataTypes) {
  var Project = sequelize.define('project', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      field: 'id'
    },
    employee_id: {
      type: DataTypes.INTEGER,
    },
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
    initialAutoIncrement: 100
  });
  return Project;
};