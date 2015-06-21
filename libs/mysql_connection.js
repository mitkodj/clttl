var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user	   : 'root'
});

module.exports = function() {
	return connection;
}