class Command {
  constructor() {

  }
  match(txt) {
    return false;
  }
  invoke(args, cb) {
      throw "override this";
  }
};

class Main {
  constructor(commands) {
    this.commands = commands.map((e) => {
      return new e();
    });
  }
  handle(client, data) {
      var txt = data["text"];
      this.commands.forEach((e) => {
        var cmd = e;
        var args = cmd.match(txt);
        if (args) {
          cmd.invoke(args, (out) => {
            client.sendMessage(out, data["channel"]);
          });
        }
      });
  }
};

module.exports = {
  Main: Main,
  Command: Command,
};
