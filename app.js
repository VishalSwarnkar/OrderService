var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var logger = require('morgan');
const config = require('dotenv').config();
const logger = require('./logger');

const orderRoutes = require("./routes/order");

var app = express();

// ============================== mongo connection
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const DB_IP_ADDRESS = process.env.DB_IP_ADDRESS || '127.0.0.1'
const url = `mongodb://${DB_IP_ADDRESS}:27017/node`

const connect = mongoose.connect(url, { useNewUrlParser: true });

connect.then((db)=>{
  logger.info('Successfully connected to db')
},(error)=>{
  logger.error('Unable to connect the DB', error);
});
// ======================================


// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ============================= routers: =============================
app.use("/orders", orderRoutes);

app.use('/get', (res, req, next)=>{
  throw new Error('this is error')
})

// function middlewareError(err, re, res, next){
//   console.oog("Error", err);
//   next(err)
// }

// app.use('/custom-error', (res, req, next)=>{

// }, middlewareError)
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   res.json({error: true})
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
