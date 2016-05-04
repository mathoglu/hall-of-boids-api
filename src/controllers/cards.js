var fs = require('fs'),
  path = require('path'),
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
  return cards;
}

function get(id) {
  return {
    _data: cards._data.filter(function(a) { return parseInt(a.id) == id })
  }
}

module.exports = {
  list: list,
  get: get
}
