"use strict";

module.exports = function (sequelize, DataTypes) {
  var Skill = sequelize.define('skill', {
    name: {
      type: DataTypes.STRING,
      field: 'name'
    }
  },
    {
      classMethods: {
        associate: function(models) {
          Skill.belongsTo(models.skillCategory);
          Skill.belongsToMany(models.employee, {through: models.employeeSkill, foreign_key: "skillId"});
        }
      }});
  return Skill;
};