var config = require('./config');
var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    bodyParser = require('body-parser'),
    cardsRouter = require('./src/routes/cards.routes'),
    port = process.env.PORT || 3333;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT");
  if(req.method === 'OPTIONS') {
      res.send(200);
      return;
  }
  next();
});

//app.use('/api', indexRouter);
app.use('/api/cards', cardsRouter);

var server = app.listen(port);
require('util').log('Library hosted on port ' + port);

module.exports = server;