var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var paginate = require('express-paginate');

var imageRoutes = require('./routes/image');
var questionRoutes = require('./routes/question');
var authRoutes = require('./routes/auth');
var adminQuestionRoutes = require('./routes/adminquestion');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/medicaltrivia')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

var app = express();

app.use(paginate.middleware(10, 50));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'dist/mean-angular6')));
app.use('/', express.static(path.join(__dirname, 'dist/mean-angular6')));
app.use('/api/image', imageRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/question', adminQuestionRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.status);
});

module.exports = app;
