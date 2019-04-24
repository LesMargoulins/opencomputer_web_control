module.exports = function() {
    var debugBold = clc.yellow.bold;
    var debug = clc.yellow;

    var errorBold = clc.red.bold;
    var error = clc.red.bold;

    var infosBold = clc.cyan.bold;
    var infos = clc.cyan;

    var successBold = clc.green.bold;
    var success = clc.green;

    ["log", "warn", "error", "debug"].forEach(function(method) {
        var oldMethod = console[method].bind(console);
        console[method] = function() {
            process.stdout.clearLine();  // clear current text
            process.stdout.cursorTo(0);
            oldMethod.apply(
                console,
                arguments
            );
            if (config.loaded)
                process.stdout.write(config.prompt);
            else
                process.stdout.write(infosBold("[LOADING ...]"));
        };
    });

    this.debug = {
        detail: function(message, force = false) {
            if (!config.debug && !force)
                return;
            console.log(message);
        },
        log: function(message, title = "DEBUG", force = false) {
            if (!config.debug && !force)
                return;
            console.log(debugBold("[" + title + "]") + " " + message);
        },
        logError: function(message, title = "ERROR", force = false) {
            if (!config.debug && !force)
                return;
            console.error(errorBold("[" + title + "]") + " " + error(message));
        },
        logInfos: function(message, title = "INFOS", force = false) {
            if (!config.debug && !force)
                return;
            console.log(infosBold("[" + title + "]") + " " + infos(message));
        },
        logSuccess: function(message, title = "SUCCESS", force = false) {
            if (!config.debug && !force)
                return;
            console.log(successBold("[" + title + "]") + " " + success(message));
        },
        clear: function(force = false) {
            if (!config.debug && !force)
                return;
            process.stdout.write(clc.reset + config.prompt);
        },
        line: function(style = "=", force = false) {
            if (!config.debug && !force)
                return;
            console.log(style.repeat(process.stdout.columns));
        }
    }
};