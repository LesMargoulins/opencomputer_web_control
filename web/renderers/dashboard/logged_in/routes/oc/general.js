var router = express.Router();

router.use(async function (req, res, next) {
    declareMenu(res, "Open Computer", "Computers", "fas fa-server");

    addSubMenu(res, "Open Computer", "Computers", "My Computers", "mycomputers", "/my_computers");

    next();
})

router.get(['/my_computers'], function (req, res, next) {
    res.locals.page = "mycomputers";
    res.locals.title = "My Computers";
    res.locals.description = "List of you Open Computer machines";
    next();
})

router.post(['/my_computers'], async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');

    var computers = await safeQuery("SELECT a.*, b.name AS status_name FROM computers AS a LEFT JOIN computers_status as b ON b.id = a.status WHERE user_id = ?", [req.session.uid]);

    res.end(JSON.stringify({result: "ok", computers: computers}));
})

router.post(['/my_computers/rename'], async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');

    var id = parseInt(req.body.id);
    if (!isDefined(id) || isNaN(id)) {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect ID"}));
        return;
    }
    var name = req.body.newName;
    if (!isDefined(name) || typeof(name) !== "string") {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect name"}));
        return;
    }
    if (name.length > 20 || name.length == 0) {
        res.end(JSON.stringify({ result: "ko", message: "Name should be between 1 and 20 characters"}));
        return;
    }
    name = htmlencode.htmlEncode(name);
    if (!isDefined(name) || typeof(name) !== "string") {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect name"}));
        return;
    }

    var computers = await safeQuery("SELECT id FROM computers WHERE id = ? AND user_id = ?", [id, req.session.uid]);
    if (computers.length == 0) {
        res.end(JSON.stringify({ result: "ko", message: "This computer does not exist"}));
        return;
    }

    safeQuery("UPDATE computers SET name = ? WHERE id = ?", [name, id]);

    res.end(JSON.stringify({result: "ok", name: name}));
})

module.exports = router;