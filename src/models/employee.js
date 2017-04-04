"use strict";

module.exports = function (sequelize, DataTypes) {
  var Employee = sequelize.define('employee', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
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
  },
    {
      initialAutoIncrement: 100
    }
  );
  return Employee;
};