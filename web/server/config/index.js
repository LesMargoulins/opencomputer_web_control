module.exports = function() {
    debug.logInfos('Starting Server', "INFOS", true);

    debug.logInfos("Debug mode is enabled");
    debug.log("Loading Server Configuration");

    require("./modules/security.js")();
    require("./modules/express.js")();
    require("./modules/mysql.js")();
    require("./modules/express_middlewares.js")();
    require("./modules/axios.js")();
    require("./modules/socketio.js")();
    
    debug.log("Loading Utilities");
    require("./utilities/system.js")();
    require("./utilities/logging.js")();
    require("./utilities/functions.js")();
    require("./utilities/sidemenu.js")();
};