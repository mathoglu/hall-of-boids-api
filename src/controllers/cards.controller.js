var fs = require('fs'),
  path = require('path'),
  mapper = require('../mappers/cards.mapper').mapper,
  file = path.join(__dirname, "..", "cards.json"),
  json = '{ "_data": [] }',
  isFetched = false;

try {
  fs.accessSync(file, fs.F_OK);
  json = fs.readFileSync(file, 'utf8');
}
catch (e){}

var cards = JSON.parse(json);

function list() {
  return mapper(cards._data);
}

function get(id) {
  var card = cards._data.filter(function(a) { return parseInt(a.id) == id });
  return mapper(card);
}

module.exports = {
  list: list,
  get: get
}
