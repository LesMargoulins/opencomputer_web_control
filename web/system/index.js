module.exports = function() {
    this.clc = require("cli-color");
    this.fs = require("fs");

    //General config file
    require("./config.js")();
    //Secret config file
    require("./secret_config.js")();
    //Debug System
    require("./debug.js")();
    //Command System
    require("./command.js")();

    debug.clear(true);
    debug.line("=", true);
    debug.detail(clc.cyan.bold(config.name + " v" + config.version), true);
    debug.line("=", true);
};