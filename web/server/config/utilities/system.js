module.exports = function() {
    debug.detail(" - System");

    this.quit = async function() {
        debug.logInfos('', "Terminating", true);

        await safeQuery("UPDATE computers SET status = ?", [1]);
        sioDisconnectServer();

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        sessionStore.close();
        process.exit(0);
    };
}
