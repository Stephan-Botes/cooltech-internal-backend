const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongodb = require('./mongoRepo');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users.route');
const ousRouter = require('./routes/ous.route');
const divisionsRouter = require('./routes/divisions.route');

// Server app setup
const app = express();

// Middleware setup
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ous', ousRouter);
app.use('/divisions', divisionsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(`server error occurred`);
});

// Connects to the mongoDB repository configured in mongoRepo
mongodb.connect();

module.exports = app;
