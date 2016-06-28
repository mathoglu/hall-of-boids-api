var Promise = require('promise'),
  Joi = require('joi'),
  skillSchema = Joi.object().keys({
    rank: Joi.number(),
    name: Joi.string(),
    rating: Joi.number(),
    category: Joi.number()
  }),
  projectSchema = Joi.object().keys({
    client: Joi.string().required(),
    current: Joi.boolean(),
    description: Joi.string(),
    duration: Joi.object().keys({
      from: Joi.date().timestamp('unix'),
      to: Joi.date().timestamp('unix')
    })
  }),
  cardSchema = Joi.object().keys({
    id: Joi.number().required(),
    info: Joi.object().keys({
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      title: Joi.string()
    }),
    image: Joi.string(),
    motto: Joi.string(),
    available: Joi.boolean(),
    inProcess: Joi.boolean(),
    skills: Joi.array().min(0).items(skillSchema),
    projects: Joi.array().min(0).items(projectSchema)
  }),
  cardsSchema = Joi.array().min(0).items(cardSchema)

function _errorHandler(err, reject) {
  console.error(err.name, err.details);
  reject(err);
}

function validateCards(cards) {
  return new Promise(function(resolve, reject) {
    Joi.validate(cards, cardsSchema, function(err, val) {
      if(err) _errorHandler(err, reject)
      resolve(val);
    })
  })
}

function cardsMapper(items) {
    return validateCards(items).then(
      function(cards) {
        for(var i = 0; i < cards.length; i++) {
          var currentProject = cards[i].projects.filter( function(p) { return p.current } )[0];
          if(currentProject) {
            cards[i].availableFrom = currentProject.duration.to;
          }
        }
        return cards;
      },
      function(err) {
        _errorHandler(err, function(){})
      }
    )
}



module.exports = {
  mapper: cardsMapper,
  validate: validateCards
}
