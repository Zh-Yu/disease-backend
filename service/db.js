const mysql = require('mysql');
const dbConfig = require('../config/db');

const connection = mysql.createConnection(dbConfig);
connection.connect();             //连接

process.on('exit',  () => {
  connection.close();
});

const query = sql => {                                       //返回promise对象，数据库读取结果
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
