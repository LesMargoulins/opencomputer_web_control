
module.exports = function() {
    debug.detail(" - Security");

    this.crypto             = require('crypto');
    this.csprng             = require('csprng');
    this.argon2             = require('argon2');
    this.xss                = require("xss");
    this.htmlencode         = require('htmlencode');
    this.uuid               = require("uuid/v4");
}