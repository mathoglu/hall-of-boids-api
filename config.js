module.exports = {
  "http_port": 3000,
  'https_port': 8000,
  database: {
    'dialect': 'postgres',
    'name': 'hall_of_boids_test',
    'user': 'testuser',
    'password': 'daadirlandirlandaa'
  },
  test_database: {
    'dialect':'sqlite',
    'name': 'hall_of_boids_test',
    'user': 'testuser',
    'password': 'daadirlandirlandaa'
  },
  'ssl_keyfile': '',
  'ssl_certfile': '',
  passport_auth: {
    secret_key: '06459a0ac9bcd9d425e21ce111b596122dd1225c09d3c7aa52a59e8851cd919c'
  }
};