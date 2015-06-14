var express = require('express');
var app = require('express')();
// var server = require('http').createServer(app);
var server = app.listen(3011);
var io = require('socket.io').listen(server);
var router = express.Router();
var request = require('request');
var Random = require('random-js');
var InfiniteLoop = require('infinite-loop');
var il = new InfiniteLoop;
il.add(cycleReqSend);
il.setInterval(2000);
var InfiniteLoopRunning = false;

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

  if (InfiniteLoopRunning == true) {
    il.stop();
    InfiniteLoopRunning = false;
  } else {
    il.run();
    InfiniteLoopRunning = true;
  }
  
  res.send(InfiniteLoopRunning);
});

function cycleReqSend(){
  InfiniteLoopRunning = true;
  var randNumb = Random.integer(0, 14)(Random.engines.nativeMath);
  var minVal = Random.integer(0, 10)(Random.engines.nativeMath);
  var maxVal = Random.integer(0, 10)(Random.engines.nativeMath);

  var requestQueries = [
      123456789,
      111111111,
      414141414,
      -111,
      123456789,
      111111111,
      414141414,
      -111,
      "1 OR 1=1",
      "1 AND " + minVal + "=" + maxVal,
      "1 UNION SELECT @@version, 1, 1",
      "1 UNION SELECT version(), 1, 1",
      "1 UNION SELECT @@datadir, 1, 1",
      "1 UNION SELECT database(), 1, 1",
      "1 UNION SELECT @@hostname, 1, 1", 
  ];

  var ratings = {
      'mitko': {
          '127.0.0.1': 0,
          '192.167.11.203': 0,
          '68.191.13.44': 0
      },
      'mira': {
          '127.0.0.1': 0,
          '192.167.11.203': 0,
          '68.191.13.44': 0
      },
      'ivan': {
          '127.0.0.1': 0,
          '192.167.11.203': 0,
          '68.191.13.44': 0
      },
      'test_user': {
          '127.0.0.1': 0,
          '192.167.11.203': 0,
          '68.191.13.44': 0
      }
  };

  var users = [{
      Id: 1,
      username: 'mitko',
      password: 'dimitar'
  }, {
      Id: 2,
      username: 'mira',
      password: '12345'
  }, {
      Id: 3,
      username: 'ivan',
      password: '0000'
  }, {
      Id: 4,
      username: 'test_user',
      password: 'test'
  }];

  var IPs = [
      '127.0.0.1',
      '192.167.11.203',
      '68.191.13.44'
  ];

  var query = requestQueries[randNumb];

  randNumb = Random.integer(0, 3)(Random.engines.nativeMath);

  var user = users[randNumb];

  randNumb = Random.integer(0, 2)(Random.engines.nativeMath);

  var IP = IPs[randNumb];
  
  request.post(
    {
      url:'http://127.0.0.1:3000/testTool/req', 
    form: {
      username: user.username,
      password: user.password,
      IP: IP,
      iban: query,
      rating: 0
      }
    }, 
  function(err,httpResponse,body){ /* ... */ 
    console.log(err, body);
  }
  );
}


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
