function responseMapper(items, error) {
  return {
    _data: items,
    _error: error || {}
  }
}

module.exports = responseMapper;
