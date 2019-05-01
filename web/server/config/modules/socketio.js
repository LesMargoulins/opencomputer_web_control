module.exports = function() {
    debug.detail(" - Socket.io & net");

    this.net = require('net');

    this.io = require('socket.io')(server);
    this.sharedsession = require("express-socket.io-session");

    io.use(sharedsession(session), {
        autoSave: true
    });
}