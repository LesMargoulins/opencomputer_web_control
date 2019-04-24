var router = express.Router();

router.get('/register', function (req, res, next) {
    res.locals.page = "register";
    res.locals.title = "Register";
    res.locals.description = "Register to the Pixel Admin dashboard";
    next();
})

router.post('/register', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');

    var ip = req.clientIp;

    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var sponsor = req.body.sponsor;
    var response = req.body.token;

    var secret = secretconfig.recaptchaSecret;

    var messages = [];

    if (!isDefined(username))
        messages.push({text:"Field is required", target:"username"});
    if (!isDefined(password))
        messages.push({text:"Field is required", target:"password"});
    if (!isDefined(password2))
        messages.push({text:"Field is required", target:"password2"});
    if (!isDefined(sponsor))
        messages.push({text:"Field is required", target:"sponsor"});
    
    if (messages.length > 0) {
        res.end(JSON.stringify({ result: "ko", messages: messages}));
        return;
    }


    axios.post(`https://www.google.com/recaptcha/api/siteverify`, {}, {
        params: {
            secret: secret,
            response: response,
            remoteip: ip
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }
    }).then(function (response) {
        if (response.data.success == true && response.data.action == "register") {
            if (response.data.score > 0.5) {
                if (username.length < 3 || username.length > 20)
                    messages.push({text:"Username must be between 3 and 20 characters long", target:"username"});
                if (!isAlphaNumeric(username))
                    messages.push({text:"Username should only use alphanumeric characters", target:"username"});
                if (password.length < 6)
                    messages.push({text:"Password must be at least 6 characters long", target:"password"});
                if (password != password2)
                    messages.push({text:"Passwords differs", target:"password2"});
                if (messages.length > 0) {
                    res.end(JSON.stringify({ result: "ko", messages: messages}));
                    return;
                }
                safeQuery("SELECT * FROM sponsorship_code WHERE code = ? AND validator IS NULL", [sponsor]).then(function(result) {
                    if (result.length == 0) {
                        messages.push({text:"Wrong sponsorship code", target:"sponsor"});
                        res.end(JSON.stringify({ result: "ko", messages: messages}));
                        return;
                    }
                    safeQuery("SELECT * FROM users WHERE username = ?", [username]).then(function(result) {
                        if (result.length != 0) {
                            messages.push({text:"This username is already taken", target:"username"});
                            res.end(JSON.stringify({ result: "ko", messages: messages}));
                            return;
                        }
                        getHash(password).then((result) => {
                            safeQuery("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)", [username, result.hash, result.salt]).then(function(result) {
                                var id = result.insertId;
                                safeQuery("UPDATE sponsorship_code SET validator = ? WHERE code = ?", [result.insertId, sponsor]).then(function(result) {
                                    login(req, username, id);
                                    res.end(JSON.stringify({ result: "ok" }));    
                                });
                            });
                        });
                    });    
                });
            }
            else {
                //TODO: IP Warning system, bad action = warn, too many warn = ban, warn reset every day
                res.end(JSON.stringify({ result: "ko", messages: [
                    {text:"ReCaptcha failed"}
                ] }));            
            }
        }
        else {
            res.end(JSON.stringify({ result: "ko", messages: [
                {text:"ReCaptcha failed"}
            ] }));
        }
    }).catch(function (error) {
        res.end(JSON.stringify({ result: "ko", messages: [
            {text:"ReCaptcha unavailable"}
        ] }));
    });
})

module.exports = router;