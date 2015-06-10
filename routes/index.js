var express = require('express');
var app = require('express')();
// var server = require('http').createServer(app);
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var router = express.Router();
var request = require('request');

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

app.get('/test', function(req, res) {
  var info = "some test request";
  console.log("----------------------------------------------------------------");
  io.sockets.emit("news", {info: info});
  res.send('');
});

app.post('/test', function(req, res) {
  var info = "some test request";
  console.log("----------------------------------------------------------------");
  io.sockets.emit("news", {info: info});
  res.send('');
});

app.get('/req', function(req, res) {
  var info = "some test request";
  console.log("----------------------------------------------------------------");
  request.post(
  	{url:'http://127.0.0.1:3000/test', 
  	form: {key:info}}, 
	function(err,httpResponse,body){ /* ... */ }
  );
  res.send('');
});


io.on('connection', function (socket) {
	console.log(socket);
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
    io.sockets.emit('message', data);
  // console.log('a user connected');
  });
});

module.exports = app;
