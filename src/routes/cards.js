const express = require('express'),
      cardsController = require('../controllers/cards'),
      router = express.Router();

router.route('/')
  .get(function(req,res) {
    res.json(cardsController.list());
  })

router.route('/:card_id')
  .get(function(req,res) {
    res.json(cardsController.get(req.params.card_id));
  })

module.exports = router;
