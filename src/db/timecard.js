const { Pool, TIMECARD_TABLE } = require('./conn');

var TABLE = TIMECARD_TABLE;

Pool.query(`CREATE TABLE IF NOT EXISTS ${TABLE} (` + 
          "user_id CHAR(32) not null," + 
          "date CHAR(10) not null," + 
          "start DATETIME not null," + 
          "end DATETIME not null," + 
          "INDEX(user_id, start)," + 
          "INDEX(date)" + 
        ")", (error) => {
  if (error) { console.error(`fail to create database ${error.message}`); }
});

class Record {
  constructor(user_id, start_date) {
    this.user_id = user_id;
    if (!start_date) {
      this.start_date = new Date();
      this.start();
    } else {
      this.start_date = start_date;
    }
  }
  get start_sec() {
    return Record.date2sec(this.start_date);
  }
  get current_sec() {
    return Record.date2sec(new Date());
  }
  get date() {
    return Record.date2ymd(this.start_date);
  }
  start() {
    Record.store(this.user_id, this.date, this.start_sec, this.start_sec);
  }
  finish() {
    Record.store(this.user_id, this.date, this.start_sec, this.current_sec);
  }

  static date2ymd(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;    
  }
  static date2sec(date) {
    return Math.floor(date.getTime() / 1000);
  }
  static store(id, date, start_sec, end_sec) {
    console.log(id, date, start_sec, end_sec);
    Pool.query(`SELECT * FROM ${TABLE} WHERE user_id = ? AND start = FROM_UNIXTIME(?)`, [id, start_sec], (error, rows) => {
      if (error) {
        console.error(`select database error ${error.message}`);
      } else if (rows.length > 0) {
        Pool.query(`UPDATE ${TABLE} SET end = FROM_UNIXTIME(?) WHERE user_id = ? AND start = FROM_UNIXTIME(?)`, [end_sec, id, start_sec], (error) => {
          if (error) { console.error(`update database error ${error.message}`); }
        });
      } else {
        Pool.query(`INSERT INTO timecard2 VALUES(?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))`, [id, date, start_sec, end_sec], (error) => {
          if (error) { console.error(`insert database error ${error.message}`); }
        });
      }
    });
  }
};

class Timecard {
  constructor() {
    this.users = {}
  }
  restore() {
    Pool.query(`SELECT user_id, UNIX_TIMESTAMP(start) FROM ${TABLE} WHERE start = end and date = ?`, [Record.date2ymd(new Date())], (error, rows) => {
      if (error) {
        console.error(`select database error ${error.message}`);
        return;
      }
      for (var i = 0; i < rows.length; i++) {
        console.log(`match ${row[0]} ${row[1]}`);
        this.users[id] = new Record(id, new Date(Number(row[1]) * 1000));
      }
    });
  }
  punch(data) {
    var id = data["user"];
    console.log(`timecard ${id} ${data["presence"]}`);
    if (data["presence"] == "active") {
      if (!(id in this.users)) {
        this.users[id] = new Record(id);
      }      
    } else if (id in this.users) {
      var r = this.users[id];
      delete this.users[id];
      r.finish();   
    }
  }
};

module.exports = {
  Timecard: Timecard,
  Record: Record,
};
