module.exports = function() {
    debug.detail(" - MySql");

    this.mysql = require('mysql');
    this.pool      =    mysql.createPool({
        connectionLimit : 10,
        host     : secretconfig.db_host,
        user     : secretconfig.db_user,
        password : secretconfig.db_pass,
        database : secretconfig.db_name,
        debug    : config.debugsql
    });

    this.con = {
        query: function() {
            var sql_args = [];
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var callback = args[args.length - 1]; //last arg is callback
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                if (args.length > 2) {
                    sql_args = args[1];
                }
                connection.query(args[0], sql_args, function(err, results) {
                    connection.release(); // always put connection back in pool after last query
                    if (err) {
                        console.log(err);
                        return callback(err);
                    }
                    callback(null, results);
                });
            });
        }
    }

    this.safeQuery = function(query, queryParams) {
        return new Promise(function(resolve, reject) {
            con.query(query, queryParams, function(err, result, fields) {
                if (!err) {
                    var res = JSON.parse(JSON.stringify(result));
                    var insertid = result.insertId;
                    if (insertid !== "undefined" && insertid != null)
                        res.insertId = insertid;
                    resolve(res); // Hacky solution
                } else {
                    console.log("/! SQL ERROR: " + err);
                    //reject(err);
                }
            });
        });
    };
    //USAGE EXEMPLE:
    /*
    safeQuery("SELECT * FROM users WHERE username = ? AND password = ?", [login, hash(pass)]).then(function(result) {
        if (result.length == 0) {
            console.log("no result");
            return;
        }
        console.log("Find user " + result.username);
    });
    */

    this.safeQueryKeepData = function(query, queryParams, dataToKeep) {
        return new Promise(function(resolve, reject) {
            safeQuery(query, queryParams).then(function(res) {
                res.savedData = dataToKeep;
                resolve(res);
            });
        });
    };

    this.safeQueryFromFile = function(file, queryParams) {
        var sql = fs.readFileSync(file).toString();
        return new Promise(function(resolve, reject) {
            safeQuery(sql, queryParams).then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
    //USAGE EXEMPLE:
    /*
    safeQueryFromFile(path.join(rootdir, "/sql/example.sql"), [var]).then(function(result) {
        if (result.length == 0) {
            console.log("no result");
            return;
        }
        console.log("Result", result);
    });
    */
};