const express = require('express'),
      responseMapper = require('../mappers/response.mapper'),
      cardsController = require('../controllers/cards.controller'),
      router = express.Router();

function _errorHandler(err, res, req) {
    res.status(500).json(responseMapper([], err));
}

router.route('/')
  .get(function(req,res) {
    cardsController.list().then(
      function(cards) {
        res.json(responseMapper(cards));
      },
      function(err) {
        _errorHandler(err, res, req);
      }
    );
  })

router.route('/:card_id')
  .get(function(req,res) {
    cardsController.get(req.params.card_id).then(
      function(card) {
        res.json(responseMapper(card));
      },
      function(err) {
        _errorHandler(err, res, req);
      }
    );
  })

module.exports = router;
