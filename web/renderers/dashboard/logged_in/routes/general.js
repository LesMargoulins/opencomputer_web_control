var router = express.Router();

router.use(async function (req, res, next) {
    declareMenu(res, "General", "Menu", "fa fa-user");

    addSubMenu(res, "General", "Menu", "Home", "index", "/");
    addSubMenu(res, "General", "Menu", "Demo", "demo", "/demo");

    next();
})

router.get(['/', '/index'], function (req, res, next) {
    res.locals.page = "index";
    res.locals.title = "Index";
    res.locals.description = "Page Index";
    next();
})

router.get('/demo', function (req, res, next) {
    res.locals.page = "demo";
    res.locals.title = "Demo";
    res.locals.description = "Dashboard functionnalities Demo";
    next();
})

module.exports = router;