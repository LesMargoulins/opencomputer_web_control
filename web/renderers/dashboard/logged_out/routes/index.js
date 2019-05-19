var router = express.Router();
var __ejsdir = path.join(__dirname, "../ejs");

debug.detail(" - Logged Out");

router.use(function (req, res, next) {
    if (!isLogged(req))//IS LOGGED
        next();
    else
        next("router");
});

router.use(sassMiddleware({
    src: path.join(__dirname, '../sass'),
    dest: path.join(__dirname, '../src/css'),
    debug: config.debugsass,
    outputStyle: 'compressed',
    prefix:  '/loggedout/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

//Logged out static files
router.use("/loggedout", express.static(path.join(__dirname, '../src'), { maxAge: 60 * 1000 * 60 * 24 * 365 }));

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
    res.locals.recaptcha = secretconfig.recaptchaPublic;
    next();
})

router.get(['/', '/index'], function (req, res, next) {
    res.redirect("/login");
})

router.use("/", require("./login.js"));
router.use("/", require("./register.js"));

//RENDERING PAGE
router.use(function (req, res, next) {
    if (!res.locals.page)
        res.redirect(303, "/login?redirect=" + req.url);
    else {
        res.render(path.join(__ejsdir, "template.ejs"));
    }
})

module.exports = router;