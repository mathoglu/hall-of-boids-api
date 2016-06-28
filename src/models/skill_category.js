module.exports = function (sequelize, DataTypes) {
  var SkillCategory = sequelize.define('skillCategory', {
      name: {
        type: DataTypes.STRING,
        field: 'name'
      }
    },
    {
    classMethods: {
      associate: function(models) {
        SkillCategory.hasMany(models.skill);
      }
    }
  });
  return SkillCategory;
};