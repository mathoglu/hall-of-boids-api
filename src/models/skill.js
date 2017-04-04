"use strict";

module.exports = function (sequelize, DataTypes) {
  var Skill = sequelize.define('skill', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    employee_id: {
      type: DataTypes.INTEGER,
      field: 'employee_id'
    },
    name: {
      type: DataTypes.STRING,
      field: 'name'
    },
    rating: {
      type: DataTypes.INTEGER,
      field: 'rating'
    }
  },
    {
      initialAutoIncrement: 100
    }
  );
  return Skill;
};