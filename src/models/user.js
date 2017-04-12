"use strict";

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      field: 'username'
    },
    hash: {
      type: DataTypes.STRING,
      field: 'password'
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'user']
    }
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });
  return User;
};