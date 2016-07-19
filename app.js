'use strict';

require('dotenv').config(); // load in env variables

console.log({
	consumer_key: process.env.YELP_CONSUMER_KEY,
	consumer_secret: process.env.YELP_TOKEN,
	token: process.env.YELP_TOKEN,
	token_secret: process.env.YELP_TOKEN_SECRET
})


///// app declaration /////
const express = require('express');
const path = require('path');
const http = require('http');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8080;

let app = express();
let server = http.createServer(app);

let mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/testdb'; // or whatever name of database
mongoose.connect(mongoUrl, err => {
	console.log(err || `MongooseDB connected to ${mongoUrl}`);
})

server.listen(PORT, err => {
	console.log(err || `Server listening on PORT ${PORT}`)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // dragonfly
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // req.cookies
app.use(express.static(path.join(__dirname, 'public')));

//// ROUTERS ////

app.use('/api', require('./routes/api'))

////////////////

app.get('/', (req, res) => {
	res.render('index', { title: 'Find N\' Favorite' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err); // pass in argument to next --> passes on to error middleware below
});

// error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send(err);
});
