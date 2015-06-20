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
var anomalyQueries = [];
var patterns = require('../libs/patterns');
var Q = require('Q');
var _ = require('lodash');

app.get('/', function(req, res) {

  patterns.getIPs()
  .then(function(results) {
    var ipResults = _.map(results, function(element) {
      return element.IP;
    });

    res.render('index', {IPs: ipResults});
  })
});

app.get('/test', function(req, res) {
  var info = "some test request";
  console.log("----------------------------------------------------------------");
  io.sockets.emit("news", {info: info});
  res.send('');
});

app.post('/addIP', function(req, res) {

  patterns.addIP(req.body.ip)
  .then(function(results) {

    interfaceRes.patterns.push(req.body.pattern);
      res.send(interfaceRes.patterns);
  })
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

    patterns.getPatterns()
    .then(function(anomalies){

      console.log(anomalies);
      var patternResults = _.map(anomalies.patterns, function(element) {
        return element.pattern;
      });

      var fillResults = _.map(anomalies.fills, function(element) {
        return element.fill_text;
      });
      anomalyQueries = _.flatten(_.map(patternResults, function (element) {

        if (element.indexOf('{0}') >= 0 && element.indexOf('{1}') < 0) {
          return _.map(fillResults, function(fill) {
            return element.replace( '{0}',fill);
          });
        } else {
          if (element.indexOf('{0}') >= 0 && element.indexOf('{1}') >= 0) {
            var minVal = Random.integer(0, 10)(Random.engines.nativeMath);
            var maxVal = Random.integer(0, 10)(Random.engines.nativeMath);
            return element.replace( '{0}',minVal).replace( '{1}',maxVal);
          } else {
            return element; 
          }
        }
      }));


      var requestQueries = [
          123456789,
          111111111,
          414141414,
          -111
      ];

      var queryLength = anomalyQueries.length;

      for (var j = 0; j < queryLength; j++) {
        anomalyQueries.push(requestQueries[j%4]);
      }

      il.run();
    });
    InfiniteLoopRunning = true;
  }
  
  res.send(InfiniteLoopRunning);
});

function cycleReqSend(){
  InfiniteLoopRunning = true;
  console.log(anomalyQueries);

  var randNumb = Random.integer(0, anomalyQueries.length - 1)(Random.engines.nativeMath);
  var minVal = Random.integer(0, 10)(Random.engines.nativeMath);
  var maxVal = Random.integer(0, 10)(Random.engines.nativeMath);

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

  var query = anomalyQueries[randNumb];

  randNumb = Random.integer(0, 3)(Random.engines.nativeMath);

  // var user = users[randNumb];
  var user = users[1];

  randNumb = Random.integer(0, 2)(Random.engines.nativeMath);

  var IP = IPs[randNumb];
  
  request.post(
    {
      url:'http://127.0.0.1:3000/tool/req', 
    form: {
      username: user.username,
      password: user.password,
      IP: IP,
      iban: query,
      rating: 0,
      test: true
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
