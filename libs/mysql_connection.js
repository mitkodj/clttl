var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user	   : 'root'
});

module.exports = function() {
	// console.log(connection);
	return connection;
}