var config = require('./config');
var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    bodyParser = require('body-parser'),
    authRouter = require('./src/routes/auth.routes'),
    cardsRouter = require('./src/routes/cards.routes'),
    employeesRouter = require('./src/routes/employees.routes'),
    projectsRouter = require('./src/routes/projects.routes'),
    skillsRouter = require('./src/routes/skills.routes'),
    port = process.env.PORT || 3333,
    passport = require('passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT");
  if(req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
  }
  next();
});

app.use(passport.initialize());
var passportAuthMethod = '';
if (process.env.ENVIRONMENT === 'test') {
  require('./src/auth/passport-mock-strategy')(passport);
  passportAuthMethod = 'mock';
}
else {
  require('./src/auth/passport-strategy')(passport);
  passportAuthMethod = 'jwt';
}

//app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/cards', passport.authenticate(passportAuthMethod, { session: false}), cardsRouter);
app.use('/api/employees', passport.authenticate(passportAuthMethod, { session: false}), employeesRouter);
app.use('/api/projects', passport.authenticate(passportAuthMethod, { session: false}), projectsRouter);
app.use('/api/skills', passport.authenticate(passportAuthMethod, { session: false}), skillsRouter);

var server = app.listen(port);
require('util').log('Library hosted on port ' + port);

module.exports = server;