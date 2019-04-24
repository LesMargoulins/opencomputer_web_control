/*
**  This is the server configuration file.
**  Edit it to your need.
**  If you are unsure about your modifications, make sure to save a copy of the original file.
*/
module.exports = function() {
    this.config = {
        //Current version of the project
        version: "0.1",

        name: "Project Name",

        //Server port
        port: 3000,

        //Default author of the project
        author: "Tanguy Laloix",

        //Default prompt for command line
        prompt: clc.cyan.bold("Command ") + clc.bold("> "),

        //Set "false" for release mode, "true" for debug mode
        debug: false,
        debugsql: false,
        debugsass: false,

        loaded: false
    }

    // print process.argv
    for (var i = 2; i < process.argv.length; i++) {
        arg = process.argv[i];
        if (arg.startsWith("debug=")) {
            if (arg.substring(6) == "true")
                this.config.debug = true;
            else if (arg.substring(6) == "false")
                this.config.debug = false;
        }
        if (arg.startsWith("debugsql=")) {
            if (arg.substring(9) == "true")
                this.config.debugsql = true;
            else if (arg.substring(9) == "false")
                this.config.debugsql = false;
        }
        if (arg.startsWith("debugsass=")) {
            if (arg.substring(10) == "true")
                this.config.debugsass = true;
            else if (arg.substring(10) == "false")
                this.config.debugsass = false;
        }
    }
};