module.exports = function() {
    debug.detail(" - Logging");

    this.isLogged = function(req) {
        if (!req.session.username || !req.session.uid)
            return false;
        return true;
    };

    this.login = function(req, username, id) {
        req.session.username = username;
        req.session.uid = id;
    }

    this.logout = function(req) {
        req.session.destroy(function(err) {
            // cannot access session here
        });
    }

    this.hasAuthorization = async function(id, nameOrId) {
        return new Promise(async function(resolve, reject) {
            result = nameOrId;
            if (typeof result === "string") {
                result = await(safeQuery("SELECT id FROM authorizations WHERE name = ?", [result]));
                if (result.length == 0)
                    resolve(false);
                result = result[0].id;
            }
            var groupId = await(safeQuery("SELECT group_id FROM users WHERE id = ?", [id]));
            if (groupId.length == 0)
                resolve(false);
            groupId = groupId[0].group_id;
            hasAccess = await(safeQuery("SELECT id FROM authorizations_links WHERE group_id = ? AND authorization_id = ?", [groupId, result]));
            if (hasAccess.length > 0)
                resolve(true);
            hasAccess = await(safeQuery("SELECT id FROM authorizations_links WHERE user_id = ? AND authorization_id = ?", [id, result]));
            resolve(hasAccess.length > 0);
        });
    }

    this.isBanned = async function(id) {
        return new Promise(async function(resolve, reject) {
            var banned = await(safeQuery("SELECT is_banned FROM users WHERE id = ?", [id]));
            if (banned.length == 0 || banned[0].is_banned != 0)
                resolve(true);
            resolve(false);
        });
    }

    this.setBan = async function(id, ban = false) {
        if (ban != false)
            ban = true;
        return new Promise(async function(resolve, reject) {
            var result = await(safeQuery("UPDATE users SET is_banned = ? WHERE id = ?", [ban, id]));
            resolve(true);
        });
    }

    this.assignUserToGroup = async function(id, groupIdOrName) {
        return new Promise(async function(resolve, reject) {
            if (typeof groupIdOrName === "string") {
                groupIdOrName = await(safeQuery("SELECT id FROM groups WHERE name = ?", [groupIdOrName]));
                if (groupIdOrName.length == 0)
                    resolve(false);
                groupIdOrName = groupIdOrName[0].id;
            }
            result = await safeQuery("UPDATE users SET group_id = ? WHERE id = ?", [groupIdOrName, id]);
            resolve (true);
        });
    }

    this.addScore = async function(target, score, name, desc = "") {
        return new Promise(async function(resolve, reject) {
            await safeQuery("INSERT INTO score_history (target, score, name, description) VALUES (?, ?, ?, ?)", [target, score, name, desc])
            resolve(true);
        });
    }

    this.getGroupId = async function(userId) {
        return new Promise(async function(resolve, reject) {
            result = await safeQuery("SELECT group_id FROM users WHERE id = ?", [userId])
            if (result.length == 0)
                resolve(false);
            else
                resolve(result[0].group_id);
        });
    }

    this.getGroup = async function(groupId) {
        return new Promise(async function(resolve, reject) {
            result = await safeQuery("SELECT * FROM groups WHERE id = ?", [groupId])
            if (result.length == 0)
                resolve(false);
            else
                resolve(result[0]);
        });
    }
};