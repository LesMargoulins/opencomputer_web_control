module.exports = function() {
    debug.detail(" - Express");

    this.express = require('express');
    this.app = express();
    this.server = require('http').Server(app);
    this.path = require('path');
    this.private = path.join(rootdir, 'src/private');

    //INIT:
    app.set('view engine', 'ejs');
};