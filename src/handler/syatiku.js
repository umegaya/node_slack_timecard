const { Command } = require('./main');
const { Pool, TIMECARD_TABLE } = require('../db/conn');

class SyatikuCommand extends Command {
  match(txt) {
    var m = txt.match(/社畜ランキング\s*([\-0-9]*)/);
    if (!m) {
      m = txt.match(/workaholic\s*ranking\s*([\-0-9]*)/);
      if (!m) {
        return false;
      }
    }
    if (!m[1]) { return [ false, false ]; }
    var m2 = m[1].match(/(20[0-9]{2})\-([0-9]{1,2})/);
    if (m2) {
      return [m2[1], m2[2]];
    }
    m3 = m[1].match(/[0-9]{1,2}/);
    if (m3) {
      return [false, m3[0]];
    }
    return [false, false]
  }
  invoke(args, cb) {
    SyatikuCommand.make_ranking(args[0], args[1], cb)
  }
  static make_ranking(year, mon, cb) {
    var date = new Date();
    year = year || date.getFullYear();
    mon = mon || (date.getMonth() + 1);
    Pool.query("select name, SUM(UNIX_TIMESTAMP(end) - UNIX_TIMESTAMP(start)) as working_sec " + 
              `from ${TIMECARD_TABLE} right join names on ${TIMECARD_TABLE}.user_id = names.user_id ` + 
              `where date like '${year}-${mon}-%%' group by name ` + 
              "order by working_sec desc;", (error, rows) => {
      if (error) {
        console.error(`fail to join: ${error.message}`);
        cb(error.message);
        return;
      }
      if (rows.length <= 0) {
        cb("no one join ranking");
        return;
      }
      var text = "name\tworking_sec\n";
      rows.forEach((e) => {
        text += `${e.name}\t${e.working_sec}\n`;
      });
      cb(text);
    });
  }
}

module.exports = SyatikuCommand;
