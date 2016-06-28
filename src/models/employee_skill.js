"use strict";

module.exports = function (sequelize, DataTypes) {
  var EmployeeSkill = sequelize.define('employeeSkill', {
    rating: {
      type: DataTypes.INTEGER,
      field: 'rating'
    },
    rank: {
      type: DataTypes.INTEGER,
      field: 'ranking'
    }
  },
    {
      classMethods: {
        associate: function(models) {
          EmployeeSkill.belongsTo(models.employee, {through: 'employeeId'});
          EmployeeSkill.belongsTo(models.skill, {through: 'skillId'});
        }
      }
    }
  );
  return EmployeeSkill;
};