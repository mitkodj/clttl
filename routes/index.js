var express = require('express');
var app = require('express')();
// var server = require('http').createServer(app);
var server = app.listen(3011);
var io = require('socket.io').listen(server);
var router = express.Router();
var request = require('request');
var Random = require('random-js');

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

  var randNumb = Random.integer(0, 2)(Random.engines.nativeMath);
  var rands = [
  	-111,
    "1 OR 1=1",
    "1 UNION SELECT @@hostname, 1, 1"
  ];

  var query = rands[randNumb];

  request.post(
  	{url:'http://127.0.0.1:3000/testTool/req', 
  	form: {
  		username: 'mitko',
  		IP: '127.0.0.1',
  		iban: query,
  		rating: 0
  		}
  	}, 
	function(err,httpResponse,body){ /* ... */ 
    console.log(err, body);
  }
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
