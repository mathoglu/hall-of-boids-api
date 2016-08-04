var Promise = require('promise'),
  Joi = require('joi'),
  skillSchema = Joi.object().keys({
    id: Joi.number().required(),
    rank: Joi.number(),
    name: Joi.string().required(),
    rating: Joi.number(),
    category: Joi.number()
  }),
  skillsSchema = Joi.array().min(0).items(skillSchema);

function _errorHandler(err, reject) {
  console.error(err.name, err.details);
  reject(err);
}

function validateSchema(item, schema) {
  return new Promise(function(resolve, reject) {
    var itemObject;
    if (typeof item === 'string' || item instanceof String) {
      itemObject = JSON.parse(item);
    }
    else {
      itemObject = item;
    }
    Joi.validate(itemObject, schema, {stripUnknown: true}, function(err, val) {
      if (err)
        _errorHandler(err, reject);
      resolve(itemObject)
    })
  })
}

function validateCard(skill) {
  return validateSchema(skill, skillSchema);
}

function validateCards(skills) {
  if (Array.isArray(skills)) {
    return validateSchema(skills, skillsSchema);
  }
  else {
    return validateCard(skills);
  }
}

function skillMapper(item) {
  return validateCard(item).then(
    function (skill) {
      return setAvailability(skill);
    },
    function (err) {
      _errorHandler(err, function() {});
    }
  )
}

function skillsMapper(items) {
  if (Array.isArray(items)) {
    return validateCards(items).then(
      function(skills) {
        return setAvailabilities(skills);
      },
      function(err) {
        _errorHandler(err, function(){})
      }
    )
  }
  else {
    return skillMapper(items);
  }
}



module.exports = {
  schema: skillSchema,
  mapper: skillsMapper,
  validate: validateCards
}
