var createError = require('http-errors');
var express = require('express');
var path = require('path');
const logger = require('./logger');
const bodyParser = require('body-parser')
const orderRoutes = require("./routes/order");
const morgan = require('morgan');
const authentic = require('./services/authorization');
const route = express.Router();
require('dotenv').config();
// ============================= views
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// =============================== middle ware ====
app.use(morgan('dev'))

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ============================= routers: =============================
app.post('/authenticate', authentic.setToken);
app.use('/api', route);

route.use(authentic.authorization);
route.use("/", orderRoutes);

module.exports = app;
