/*
**  This is the server configuration file.
**  Edit it to your need.
**  If you are unsure about your modifications, make sure to save a copy of the original file.
**  MAKE SURE TO NEVER SHARE YOUR CONFIGURATION
**  Rename this file to secret_config.js
*/
module.exports = function() {
    this.secretconfig = {
        //Does the server use SSL
        ssl: false,
        trustproxy: false,

        //Session secret
        sessionSecret: "session module secret", //DO NOT SHARE

        // Recaptcha Config (if used)
        recaptchaPublic: "recaptcha site key",//Site Key, you can share this one
        recaptchaSecret: "recaptcha secret key",//Secret Key

        //Database Configuration
        db_host: "127.0.0.1",//DB IP
        db_user: "username",//DB Username
        db_pass: "password",//DB Password
        db_name: "database",//DB Name

        //Extra salt (fixed) for hashing, in addition to csprng salt
        fixedsalt: "hash salt 42"
    }

    //Password Hashing Function
    this.getHash = async function(password) {
        return new Promise(function(resolve, reject) {
            var salt = csprng(64, 36);
            argon2.hash(password + this.secretconfig.fixedsalt + salt, {
                type: argon2.Argon2id,
            }).then((hash) => {
                resolve({hash: hash, salt: salt});
            }).catch((error) => {
                reject(error)
            });
        });
    }

    //Password Checking Function
    this.checkPass = async function(hash, password, salt) {
        return new Promise(function(resolve, reject) {
            argon2.verify(hash, password + this.secretconfig.fixedsalt + salt, {
                type: argon2.Argon2id,
            }).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error)
            });
        });
    }

    //Custom Coupon/Code Generator
    this.generateCoupon = function(size, separator = false, separatorx = 5, sizeIncludeSeparator = false) {
        code = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var count = 0;
        while (count < size) {
            if (separator != false && count % separatorx == 0 && count > 0 && count + 1 < size && code[code.length - 1] != separator) {
                code += separator;
            }
            else {
                code += possible.charAt(Math.floor(Math.random() * possible.length));
                if (!sizeIncludeSeparator)
                    count += 1;
            }
            if (sizeIncludeSeparator)
                count += 1;
        }
        return (code);
    }

    //generateCoupon(30, "-")
};