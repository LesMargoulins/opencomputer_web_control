var router = express.Router();
var __ejsdir = path.join(__dirname, "../ejs");

debug.detail(" - Logged In");

router.use(function (req, res, next) {
    if (isLogged(req))//IS LOGGED
        next();
    else
        next("router");
});

router.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, '../sass'),
    dest: path.join(__dirname, '../src/css'),
    debug: config.debugsass,
    outputStyle: 'compressed',
    prefix:  '/loggedin/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

//Logged static files
router.use("/loggedin", express.static(path.join(__dirname, '../src')));

router.use(function (req, res, next) {
    res.locals.page = false;
    res.locals.title = "UNDEFINED";
    res.locals.appname = config.name;
    res.locals.author = config.author;
    res.locals.description = "";
    res.locals.version = config.version;
    res.locals.fs = fs;
    res.locals.path = path;
    res.locals.__ejsdir = __ejsdir;
    res.locals.sidemenu = [];

    res.locals.username = req.session.username;

    next();
})

router.get(['/login', '/register'], function (req, res, next) {
    res.redirect(303, "/");
})

router.use(async function (req, res, next) {
    if (await isBanned(req.session.uid)) {
        logout(req);
        res.redirect(303, "/login");
        return;
    }
    next();
})

router.use("/", require("./general.js"));
router.use("/", require("./oc/index.js"));
router.use("/", require("./admin.js"));

router.post('/logout', function (req, res, next) {
    logout(req);
    res.redirect(303, "/login");
})

//RENDERING PAGE
router.use(function (req, res, next) {
    if (!res.locals.page)
        renderError(res, 404, "La page demandée n'existe pas!");
    else {
        res.render(path.join(__ejsdir, "template.ejs"));
    }
})

module.exports = router;