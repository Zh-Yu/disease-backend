const mysql = require('mysql');
const dbConfig = require('../config/db');

const connection = mysql.createConnection(dbConfig);
connection.connect();

process.on('exit',  () => {
  connection.close();
});

const query = sql => {
	return new Promise((resolve, reject) => {
		connection.query(sql, function (error, results, fields) {
		  if (error) reject(error);
		  else resolve(results);
		});
	})
}

module.exports = {
	query
};
