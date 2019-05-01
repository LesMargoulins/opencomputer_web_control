var router = express.Router();

router.use(async function (req, res, next) {
    declareMenu(res, "Open Computer", "Computers", "fas fa-server");

    addSubMenu(res, "Open Computer", "Computers", "My Computers", "mycomputers", "/my_computers");

    next();
})

router.get(['/my_computers'], function (req, res, next) {
    res.locals.page = "mycomputers";
    res.locals.title = "My Computers";
    res.locals.description = "List of your Open Computer machines";
    next();
})

router.get(['/my_computer/:computer_id'], async function (req, res, next) {
    var computer_id = parseInt(req.params.computer_id);
    if (isNaN(computer_id) || computer_id <= 0) {
        return next();
    }
    var computer = await safeQuery("SELECT * FROM computers WHERE id = ? AND user_id = ?", [computer_id, req.session.uid])
    if (computer.length <= 0) {
        return next();
    }
    res.locals.page = "mycomputer";
    res.locals.title = "Computer #" + computer_id;
    res.locals.description = "Open Computer Machine's interface";
    res.locals.computer_id = computer_id;
    next();
})

router.post(['/my_computer'], async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');

    var computer_id = req.body.computer_id;
    if (!isDefined(computer_id) || typeof(computer_id) !== "string") {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect Computer Id"}));
        return;
    }

    var computer = await safeQuery("SELECT a.*, b.name AS status_name FROM computers AS a LEFT JOIN computers_status as b ON b.id = a.status WHERE a.id = ? AND a.user_id = ?", [computer_id, req.session.uid]);
    if (computer.length <= 0) {
        res.end(JSON.stringify({ result: "ko", message: "Computer not founded"}));
        return;
    }

    res.end(JSON.stringify({result: "ok", computer: computer[0]}));
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

router.post(['/my_computers/link'], async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');

    var computer_id = req.body.computer_id;
    if (!isDefined(computer_id) || typeof(computer_id) !== "string") {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect Computer Id"}));
        return;
    }

    var ip_address = req.body.ip_address;
    if (!isDefined(ip_address) || typeof(ip_address) !== "string") {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect IP Address"}));
        return;
    }

    var computer = await safeQuery("SELECT a.*, b.name AS status_name FROM computers AS a LEFT JOIN computers_status as b ON b.id = a.status WHERE server_ip = ? AND computer_id = ?", [ip_address, computer_id]);
    if (computer.length <= 0) {
        res.end(JSON.stringify({ result: "ko", message: "This computer does not exist"}));
        return;
    }
    if (computer[0].user_id != null) {
        if (computer[0].user_id == req.session.uid)
            res.end(JSON.stringify({ result: "ko", message: "You already linked this computer"}));
        else
            res.end(JSON.stringify({ result: "ko", message: "This computer is linked to someone else's account"}));
        return;
    }

    await safeQuery("UPDATE computers SET user_id = ? WHERE id = ?", [req.session.uid, computer[0].id]);
    res.end(JSON.stringify({result: "ok", computer: computer[0]}));
})

router.post(['/my_computers/unlink'], async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');

    var computer_id = req.body.computer_id;
    if (!isDefined(computer_id) || typeof(computer_id) !== "string") {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect Computer Id"}));
        return;
    }

    var computer = await safeQuery("SELECT * FROM computers WHERE id = ?", [computer_id]);
    if (computer.length <= 0) {
        res.end(JSON.stringify({ result: "ko", message: "This computer does not exist"}));
        return;
    }
    if (computer[0].user_id == null || computer[0].user_id != req.session.uid) {
        res.end(JSON.stringify({ result: "ko", message: "This computer is not linked to your account"}));
        return;
    }

    await safeQuery("UPDATE computers SET user_id = NULL WHERE id = ?", [computer[0].id]);
    res.end(JSON.stringify({result: "ok"}));
})

module.exports = router;