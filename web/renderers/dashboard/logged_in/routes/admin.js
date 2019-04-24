var router = express.Router();

router.use(async function (req, res, next) {
    declareMenu(res, "Admin", "Manage", "fas fa-tools");

    if (await hasAuthorization(req.session.uid, "MANAGE_USERS")) {
        addSubMenu(res, "Admin", "Manage", "Users", "manage_users", "/manage_users");
    }

    next();
})

router.get('/manage_users', async function (req, res, next) {
    if (!await hasAuthorization(req.session.uid, "MANAGE_USERS")) {
        next();
    }
    res.locals.page = "manage_users";
    res.locals.title = "Users Management";
    res.locals.description = "Manage registered users";
    next();
})

router.post('/manage_users', async function (req, res, next) {
    if (!await hasAuthorization(req.session.uid, "MANAGE_USERS")) {
        next();
    }
    res.setHeader('Content-Type', 'application/json');

    var page = req.body.page;
    if (!isDefined(page))
        page = 0;
    page = parseInt(page);
    if (isNaN(page) || page < 0)
        page = 0;
    var limit = req.body.limit;
    if (!isDefined(limit))
        limit = 10;
    limit = parseInt(limit);
    if (isNaN(limit) || limit > 100 || limit < 1)
        limit = 10;

    var search = req.body.search;
    if (!isDefined(search) || typeof search !== "string" || search == "" || search.length > 20) {
        search = false;
    }

    page = page * limit;

    if (!search) {
        var users = await safeQuery("SELECT a.*, b.name AS groupname, b.id AS groupid, GROUP_CONCAT(DISTINCT d.name) AS auth FROM users AS a INNER JOIN groups as b ON (b.id=a.group_id) LEFT JOIN authorizations_links AS c ON (c.user_id=a.id) LEFT JOIN authorizations AS d ON (d.id=c.authorization_id) GROUP BY a.id ORDER BY a.id ASC LIMIT ?, ?", [page, limit]);
    }
    else {
        search = "%" + search + "%";
        var users = await safeQuery("SELECT a.*, b.name AS groupname, b.id AS groupid, GROUP_CONCAT(DISTINCT d.name) FROM users AS a INNER JOIN groups as b ON (b.id=a.group_id) LEFT JOIN authorizations_links AS c ON (c.user_id=a.id) LEFT JOIN authorizations AS d ON (d.id=c.authorization_id) WHERE a.username LIKE ? OR a.id LIKE ? OR b.name LIKE ? GROUP BY a.id ORDER BY a.id ASC LIMIT ?, ?", [search, search, search, page, limit]);
    }
    var totalUsers = await safeQuery("select count(id) as num_rows from users");

    res.end(JSON.stringify({entries: users, total: totalUsers[0].num_rows}));
})

router.post('/ban_user', async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (!await hasAuthorization(req.session.uid, "BAN_USERS")) {
        res.end(JSON.stringify({ result: "ko", message: "You are not allowed to do that."}));
        return;
    }

    var id = parseInt(req.body.id);
    if (!isDefined(id) || isNaN(id)) {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect user ID"}));
        return;
    }
    if (id == req.session.uid) {
        res.end(JSON.stringify({ result: "ko", message: "You can't ban yourself"}));
        return;
    }
    var result = await safeQuery("SELECT id FROM users where id = ?", [id]);
    if (result.length == 0) {
        res.end(JSON.stringify({ result: "ko", message: "This user doesn't exist"}));
        return;
    }
    if (!await hasAuthorization(req.session.uid, "OVERPASS_RESTRICTIONS")) {
        if (await hasAuthorization(id, "CANNOT_BE_BANNED")) {
            res.end(JSON.stringify({ result: "ko", message: "This user cannot be banned"}));
            return;
        }
    }
    result = await setBan(id, true);
    if (result)
        res.end(JSON.stringify({ result: "ok"}));
    else
        res.end(JSON.stringify({ result: "ko", message: "An error occured while trying to ban"}));
})

router.post('/unban_user', async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (!await hasAuthorization(req.session.uid, "BAN_USERS")) {
        res.end(JSON.stringify({ result: "ko", message: "You are not allowed to do that."}));
        return;
    }

    var id = parseInt(req.body.id);
    if (!isDefined(id) || isNaN(id)) {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect user ID"}));
        return;
    }
    if (id == req.session.uid) {
        res.end(JSON.stringify({ result: "ko", message: "You can't unban yourself"}));
        return;
    }
    var result = await safeQuery("SELECT id FROM users where id = ?", [id]);
    if (result.length == 0) {
        res.end(JSON.stringify({ result: "ko", message: "This user doesn't exist"}));
        return;
    }
    result = await setBan(id, false);
    if (result)
        res.end(JSON.stringify({ result: "ok"}));
    else
        res.end(JSON.stringify({ result: "ko", message: "An error occured while trying to ban"}));
})

router.post('/change_user_group', async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (!await hasAuthorization(req.session.uid, "CHANGE_USERS_GROUP")) {
        res.end(JSON.stringify({ result: "ko", message: "You are not allowed to do that."}));
        return;
    }

    var id = parseInt(req.body.id);
    var groupId = parseInt(req.body.groupId);
    if (!isDefined(id) || isNaN(id)) {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect user ID"}));
        return;
    }
    if (!isDefined(groupId) || isNaN(groupId)) {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect group ID"}));
        return;
    }
    if (id == req.session.uid) {
        res.end(JSON.stringify({ result: "ko", message: "You can't change your own group"}));
        return;
    }
    var result = await safeQuery("SELECT id FROM users where id = ?", [id]);
    if (result.length == 0) {
        res.end(JSON.stringify({ result: "ko", message: "This user doesn't exist"}));
        return;
    }
    result = await safeQuery("SELECT id, priority FROM groups where id = ?", [groupId]);
    if (result.length == 0) {
        res.end(JSON.stringify({ result: "ko", message: "This group doesn't exist"}));
        return;
    }
    if (!await hasAuthorization(req.session.uid, "OVERPASS_RESTRICTIONS")) {
        myGroup = await getGroup(await getGroupId(req.session.uid));
        if (myGroup.priority <= result[0].priority) {
            res.end(JSON.stringify({ result: "ko", message: "You can't give a group with same or better privileges than yours"}));
            return;
        }    
        if (await hasAuthorization(id, "CANNOT_CHANGE_GROUP")) {
            res.end(JSON.stringify({ result: "ko", message: "You can't change this user's group"}));
            return;
        }
    }
    result = await assignUserToGroup(id, groupId);
    if (result) {
        var groupName = await safeQuery("SELECT name FROM groups WHERE id = ?", [groupId]);
        groupName = groupName[0].name;
        res.end(JSON.stringify({ result: "ok", message: groupName}));
    }
    else
        res.end(JSON.stringify({ result: "ko", message: "An error occured while assigning group"}));
})

router.post('/delete_user', async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (!await hasAuthorization(req.session.uid, "DELETE_USERS")) {
        res.end(JSON.stringify({ result: "ko", message: "You are not allowed to do that."}));
        return;
    }

    var id = parseInt(req.body.id);
    if (!isDefined(id) || isNaN(id)) {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect user ID"}));
        return;
    }
    if (id == req.session.uid) {
        res.end(JSON.stringify({ result: "ko", message: "You can't delete yourself"}));
        return;
    }
    var result = await safeQuery("SELECT id FROM users where id = ?", [id]);
    if (result.length == 0) {
        res.end(JSON.stringify({ result: "ko", message: "This user doesn't exist"}));
        return;
    }
    if (!await hasAuthorization(req.session.uid, "OVERPASS_RESTRICTIONS")) {
        myGroup = await getGroup(await getGroupId(req.session.uid));
        hisGroup = await getGroup(await getGroupId(id));    
        if (myGroup.priority <= hisGroup.priority) {
            res.end(JSON.stringify({ result: "ko", message: "You can't delete a user that has same or better privileges than yours"}));
            return;
        }
        if (await hasAuthorization(id, "CANNOT_BE_DELETED")) {
            res.end(JSON.stringify({ result: "ko", message: "You can't delete this user"}));
            return;
        }
    }

    result = await safeQuery("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows > 0)
        res.end(JSON.stringify({ result: "ok"}));
    else
        res.end(JSON.stringify({ result: "ko", message: "User has not been found"}));
})

router.post('/change-user-score', async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (!await hasAuthorization(req.session.uid, "CHANGE_USERS_SCORE")) {
        res.end(JSON.stringify({ result: "ko", message: "You are not allowed to do that."}));
        return;
    }

    var id = parseInt(req.body.id);
    var score = parseInt(req.body.score);
    if (!isDefined(id) || isNaN(id)) {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect user ID"}));
        return;
    }
    if (!isDefined(score) || isNaN(score) || score == 0) {
        res.end(JSON.stringify({ result: "ko", message: "Incorrect score value"}));
        return;
    }
    var result = await safeQuery("SELECT id FROM users where id = ?", [id]);
    if (result.length == 0) {
        res.end(JSON.stringify({ result: "ko", message: "This user doesn't exist"}));
        return;
    }
    if (!await hasAuthorization(req.session.uid, "OVERPASS_RESTRICTIONS")) {
        if (id != req.session.uid) {
            myGroup = await getGroup(await getGroupId(req.session.uid));
            hisGroup = await getGroup(await getGroupId(id));
        }
        if (id != req.session.uid && myGroup.priority <= hisGroup.priority) {
            res.end(JSON.stringify({ result: "ko", message: "You can't change score of a user that has same or better privileges than yours"}));
            return;
        }
        if (await hasAuthorization(id, "SCORE_CANNOT_BE_CHANGED")) {
            res.end(JSON.stringify({ result: "ko", message: "You can't change this user's score"}));
            return;
        }
    }

    await addScore(id, score, "Admin intervention");
    res.end(JSON.stringify({ result: "ok"}));
})

module.exports = router;