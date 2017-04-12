require('dotenv').config()
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
const cors = require('cors');

console.log(process.env.whitelist.split(','));
console.log();
function ipInWhitelist(req, res, next) {
  const whitelist = process.env.whitelist.split(',');
  const requestIp = req.header('x-forwarded-for') || req.ip.split(':').pop();
  console.log(requestIp);
  if (whitelist.includes(requestIp)) {
    next();
  }
  else {
    console.error(`Request received from ${requestIp} which is not on whitelist`)
  }
}

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

app.use(morgan('dev'));

app.use(ipInWhitelist);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  if(req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
  }
  next();
});


var passportAuthMethod = '';
if (process.env.ENVIRONMENT === 'test') {
  require('./test/passport-mock-strategy')(passport);
  passportAuthMethod = 'mock';
}
else {
  require('./src/auth/passport-strategy')(passport);
  passportAuthMethod = 'jwt';
}

// app.options('*', cors());
// app.use(cors({
//   origin: 'http://127.0.0.1:8080',
//   methods: 'GET,OPTIONS,HEAD,PUT,POST,PATCH,DELETE'
// }));

//app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/cards', cardsRouter);

// app.use('/api/employees', passport.authenticate(passportAuthMethod, { session: false}), employeesRouter);
app.use('/api/employees', employeesRouter);
// app.use('/api/projects', passport.authenticate(passportAuthMethod, { session: false}), projectsRouter);
app.use('/api/projects', projectsRouter);
// app.use('/api/skills', passport.authenticate(passportAuthMethod, { session: false}), skillsRouter);
app.use('/api/skills', skillsRouter);

var server = app.listen(port);
require('util').log('Library hosted on port ' + port);

module.exports = server;