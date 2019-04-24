module.exports = function() {
    debug.detail(" - System");

    this.quit = function() {
        debug.logInfos('', "Terminating", true);
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        sessionStore.close();
        process.exit(0);
    };
}
