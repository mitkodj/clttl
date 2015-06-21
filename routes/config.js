var express = require('express');
var router = express.Router();
var patterns = require('../libs/patterns');

var configIPs = [];

router.get('/', function(req, res) {
    res.send('index');
});

router.post('/', function(req, res) {
    patterns.addIPs(req.body.address)
    .then(function(results) {

      configIPs.push(req.body.address);
      res.send(configIPs);
    });
});

module.exports = router;