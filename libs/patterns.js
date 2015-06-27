var Q = require('Q');
var connection = require('./mysql_connection')();

function getPatterns() {
	var def = Q.defer();

	var query = [
	"SELECT pattern",
	"FROM diplomna_rabota.patterns P"
	].join(' ');

	connection.query(query, function(err, rowsPattern, fields) {
		if (err) throw err;

		var query = [
		"SELECT fill_text",
		"FROM diplomna_rabota.fills"
		].join(' '); 

		connection.query(query, function(err, rowsFills, fields) {
			if (err) throw err;
			
			def.resolve({
				patterns: rowsPattern,
				fills: rowsFills
			});
		});
	});

	return def.promise;
}

function getIPs() {
	var def = Q.defer();

	var query = [
	"SELECT IP",
	"FROM diplomna_rabota.ips"
	].join(' ');

	connection.query(query, function(err, ips) {
		if (err) throw err;

		def.resolve(ips);
	});

	return def.promise;
}

function addIPs(ip) {
	var def = Q.defer();

	var query = [
	"INSERT INTO diplomna_rabota.ips(IP)",
	"VALUES('" + ip + "')"
	].join(' ');

	connection.query(query, function(err, res) {
		if (err) throw err;

		query = [
		"INSERT INTO diplomna_rabota.client_status(distinctKey, rating, IP)",
		"SELECT Id, 0, '" + ip + "' FROM diplomna_rabota.user_data"
		].join(' ');

		connection.query(query, function(err, result) {
			if (err) throw err;

			def.resolve(res);
		});

	});

	return def.promise;
}

function addPattern(pattern, fill) {

	var def = Q.defer();

	var query = "";
	if (pattern) {
		query = [
		"INSERT INTO diplomna_rabota.patterns(pattern)",
		"VALUES(\'" + pattern + "\');"
		].join(' ');

		connection.query(query, function(err, rows, fields) {
			if (err) throw err;

			query = [
			"INSERT INTO diplomna_rabota.pattern_to_fill(patternId, fillId)", 
			"SELECT (SELECT Id",
			"FROM diplomna_rabota.patterns WHERE pattern = \'" + pattern + "\') as patternId, Id from", 
			"diplomna_rabota.fills",
			"on duplicate key update patternId = patternId;"
			].join(' ');

			connection.query(query, function(err, rows, fields) {
				if (err) throw err;

				def.resolve("true");
			});

		});
	} else {
		query = [
		"INSERT INTO diplomna_rabota.fills(fill_text)",
		"VALUES(\'" + fill + "\');"
		].join(' ');

		connection.query(query, function(err, rows, fields) {
			if (err) throw err;

			query = [
			"INSERT INTO diplomna_rabota.pattern_to_fill(patternId, fillId)", 
			"SELECT Id, (SELECT",
			"Id FROM diplomna_rabota.fills WHERE fill_text = \'" + fill + "\') as fillId FROM", 
			"diplomna_rabota.patterns",
			"on duplicate key update fillId = fillId;"
			].join(' ');

			connection.query(query, function(err, rows, fields) {
				if (err) throw err;

				def.resolve("true");
			});

		});
	}
	

	return def.promise;
}

module.exports = {
	    getPatterns: getPatterns,
	    addPattern: addPattern,
	    getIPs: getIPs,
	    addIPs: addIPs
};