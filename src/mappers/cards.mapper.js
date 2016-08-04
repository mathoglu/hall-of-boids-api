var Promise = require('promise'),
  Joi = require('joi'),
  skillSchema = Joi.object().keys({
    rank: Joi.number(),
    name: Joi.string(),
    rating: Joi.number(),
    category: Joi.number()
  }),
  cardProjectSchema = Joi.object().keys({
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
    projects: Joi.array().min(0).items(cardProjectSchema),
    availableFrom: Joi.date().timestamp('unix')
  }),
  cardsSchema = Joi.array().min(0).items(cardSchema)

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
    Joi.validate(itemObject, schema, function(err, val) {
      if (err)
        _errorHandler(err, reject);
      resolve(itemObject)
    })
  })
}

function validateCard(card) {
  return validateSchema(card, cardSchema);
}

function validateCards(cards) {
  if (Array.isArray(cards)) {
    return validateSchema(cards, cardsSchema);
  }
  else {
    return validateCard(cards);
  }
}

function setAvailability(card) {
  var currentProject = card.projects.filter( function(p) {return p.current }) [0];
  if (currentProject) {
    card.availableFrom = currentProject.duration.to
  }
  return card;
}

function setAvailabilities(cards) {
  for (var i = 0; i < cards.length; i++) {
    cards[i] = setAvailability(cards[i]);
  }
  return cards;
}

function cardMapper(item) {
  return validateCard(item).then(
    function (card) {
      return setAvailability(card);
    },
    function (err) {
      _errorHandler(err, function() {});
    }
  )
}

function cardsMapper(items) {
  if (Array.isArray(items)) {
    return validateCards(items).then(
      function(cards) {
        return setAvailabilities(cards);
      },
      function(err) {
        _errorHandler(err, function(){})
      }
    )
  }
  else {
    return cardMapper(items);
  }
}



module.exports = {
  schema: cardSchema,
  mapper: cardsMapper,
  validate: validateCards
}
