module.exports = function() {
    var stdin = process.openStdin();

    var commands = [];

    this.command = {
        create: function(usage, description, callback) {
            commands[usage] = {description, callback};
        },
    }

    function printSingleHelp(key) {
        if (commands.hasOwnProperty(key)) {
            debug.detail(clc.bold(key) + ": " + commands[key].description, true);
        }
    }

    //Print help message depending on created commands
    function printHelp(page) {
        pageIndex = page - 1;
        itemByPage = 10;
        if ((Object.keys(commands).length - 1) / itemByPage < pageIndex) {
            debug.logError("Help page " + page + " doesn't exist.", "ERROR", true);
            return;
        }
        for (var i = pageIndex * itemByPage; i < pageIndex * itemByPage + itemByPage; i++) {
            var k = Object.keys(commands)[i];
            printSingleHelp(k);
        }
        debug.detail("", true);
        debug.detail(clc.yellow("Page " + page + "/" + parseInt((Object.keys(commands).length - 1) / itemByPage + 1)), true);
    }

    //Call help message
    this.command.create("help [command/page]", "This command", (command) => {
        if (command[0].toLowerCase() != "help")
            return false;
        if (command.length == 1) {
            printHelp(1);
        }
        else {
            if (parseInt(command[1]) > 0) {
                var i = parseInt(command[1]);
                printHelp(i);
            }
            else {
                var i = 0;
                for (var k in commands) {
                    if (k.includes(command[1])) {
                        i += 1;
                        printSingleHelp(k);
                    }
                }
                if (i == 0)
                    debug.detail(clc.red("No match found for command \"" + command[1] + "\"."), true);
            }
        }
        return true;
    });

    this.command.create("clear", "Clear the console", (command) => {
        if (command[0].toLowerCase() != "clear")
            return false;
        debug.clear(true);
        return true;
    });

    this.command.create("quit", "close the server", (command) => {
        if (command[0].toLowerCase() != "quit" && command[0].toLowerCase() != "exit")
            return false;
        quit();
        return true;
    });

    this.command.create("debug [true/false]", "See or change debug mode", (command) => {
        if (command[0].toLowerCase() != "debug")
            return false;
        if (command.length == 1) {
            debug.detail(clc.yellow("Debug mode set to " + config.debug), true);
            debug.detail(clc.yellow("SASS Debug mode set to " + config.debugsass), true);
            debug.detail(clc.yellow("SQL Debug mode set to " + config.debugsql), true);
            return true;
        }
        value = command[1].toLowerCase();
        if (value == "true") {
            config.debug = true;
            debug.detail(clc.yellow("Debug mode set to " + config.debug), true);
        }
        else if (value == "false") {
            config.debug = false;
            debug.detail(clc.yellow("Debug mode set to " + config.debug), true);
        }
        else
            debug.detail(clc.red("Usage: debug <true/false>"), true);
        return true;
    });

    stdin.addListener("data", function(d) {
        if (!config.loaded)
            return;

        var input = d.toString().trim().split(" ").filter(function(el) {return el.length != 0});
        if (input.length == 0) {
            process.stdout.write(config.prompt);
            return;
        }
        for (var k in commands){
            if (commands.hasOwnProperty(k)) {
                if (commands[k].callback(input)) {
                    return;
                }
            }
        }
        debug.logError("Command not found. Type \"help\" for help.", "ERROR", true);
    });
};