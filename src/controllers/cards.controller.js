var fs = require('fs'),
  path = require('path'),
  Promise = require('promise'),
  mapper = require('../mappers/cards.mapper').mapper,
  file = path.join(__dirname, "..", "cards.json"),
  json = '{ "_data": [] }',
  isFetched = false;

function _loadFile() {
  try {
    fs.accessSync(file, fs.F_OK);
    json = fs.readFileSync(file, 'utf8');
  }
  catch (e){
    console.log("file read error:",e);
  }

  return JSON.parse(json);
}

function list() {
  var cards = _loadFile();
  return mapper(cards._data);
}

function get(id) {
  var cards = _loadFile();
  var card = cards._data.filter(function(a) { return parseInt(a.id) == id });
  return mapper(card);
}

module.exports = {
  list: list,
  get: get
}
