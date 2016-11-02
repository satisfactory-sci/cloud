var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

//test server generated with express
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req,res){
  res.sendFile(path.join(__dirname, 'index.html'));
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
});


module.exports = app;
