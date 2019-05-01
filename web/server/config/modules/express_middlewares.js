module.exports = function() {
    debug.detail(" - Express_middlewares");
    debug.detail("    > SASS");

    this.subdomain = require('express-subdomain');
    this.vhost = require('vhost');

    this.sassMiddleware = require('node-sass-middleware');
    this.bodyParser = require('body-parser');
    this.requestIp = require('request-ip');

    app.use(requestIp.mw());

    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    debug.detail("    > express-session");

    //TODO: Check later for ssl and SQL storage: https://github.com/expressjs/session
    /*if (secretconfig.trustproxy)
        app.set('trust proxy', 1) // trust first proxy for ssl*/

    this.session = require('express-session');

    this.MySQLStore = require('express-mysql-session')(session);

    this.sessionStore = new MySQLStore({}, pool);

    session = session({
        genid: (req) => {
            return uuid() // use UUIDs for session IDs
        },
        store: sessionStore,
        secret: secretconfig.sessionSecret,
        resave: false,
        saveUninitialized: true,
        rolling: true,
        proxy: secretconfig.trustproxy,
        cookie: {
            httpOnly: secretconfig.ssl,
            secure: secretconfig.ssl,
        }//True for ssl
    });

    app.use(session);

    debug.detail("    > bodyParser");
    this.bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
};