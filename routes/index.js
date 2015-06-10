var express = require('express');
var app = require('express')();
// var server = require('http').createServer(app);
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var router = express.Router();

// server.listen(8088);
// server.listen(app.get('port'), function(){
//   console.log('listening on *:' + app.get('port'));
// });

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

io.on('connection', function (socket) {
	console.log(socket);
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);

  // console.log('a user connected');
  });
});

module.exports = app;
