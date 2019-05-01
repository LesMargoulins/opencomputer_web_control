module.exports = function() {
    debug.detail(" - - - CONFIG Logged In");

    require("./config/socketio.js")();
    require("./config/sockets.js")();
}