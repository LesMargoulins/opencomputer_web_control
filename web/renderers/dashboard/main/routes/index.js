var router = express.Router();

debug.detail(" - Main routing");

router.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, '../sass'),
    dest: path.join(__dirname, '../src/css'),
    debug: config.debugsass,
    outputStyle: 'compressed',
    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

router.use("/", express.static(path.join(__dirname, '../src')));

module.exports = router;