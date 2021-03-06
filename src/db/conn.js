var mysql = require('mysql');

var pool = mysql.createPool(process.env.DBADDR || {
  connectionLimit : 1,
  host     : 'testdb.host',
  user     : 'root',
  password : 'password',
  database: 'data'
});

module.exports = {
	Pool: pool,
	TIMECARD_TABLE: 'timecard',
	MEMBER_TABLE: 'names',
};