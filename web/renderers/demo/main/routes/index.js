var router = express.Router();
var __ejsdir = path.join(__dirname, "../ejs");

debug.detail(" - Demo Main Renderer");

//GENERATING CSS FROM SASS:
router.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, '../sass'),
    dest: path.join(__dirname, '../src/css'),
    debug: config.debugsass,
    outputStyle: 'compressed',
    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

//USING STATIC FILES:
router.use("/", express.static(path.join(__dirname, '../src'), { maxAge: 60 * 1000 * 60 * 24 * 365 }));

//DEFAULT ROUTING VALUES:
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

    next();
})

router.get(['/', '/index'], function (req, res, next) {
    res.locals.page = "index";
    res.locals.title = "Index";
    res.locals.description = "Page Index";
    next();
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